const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
require("dotenv").config();

const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE } = process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);

const FRONTEND_URL = process.env.FRONTEND_URL || process.env.URL || "https://drpaystub.net";

// ─── Plan Config ────────────────────────────────────────────────────────────
const PLAN_CONFIG = {
  free:         { paystubs: 0,  w2s: 0,  payPeriods: 0,  label: "Free" },
  starter:      { paystubs: 5,  w2s: 0,  payPeriods: 6,  label: "Starter" },
  professional: { paystubs: 15, w2s: 2,  payPeriods: 12, label: "Professional" },
  unlimited:    { paystubs: Infinity, w2s: Infinity, payPeriods: Infinity, label: "Unlimited" },
};

const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_STARTER]: "starter",
  [process.env.STRIPE_PRICE_PROFESSIONAL]: "professional",
  [process.env.STRIPE_PRICE_UNLIMITED]: "unlimited",
};

// Auth middleware
function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.payload.user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ─── GET /status — Current plan + usage ─────────────────────────────────────
router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = user.subscription?.plan || "free";
    const status = user.subscription?.status || null;
    const config = PLAN_CONFIG[plan] || PLAN_CONFIG.free;

    // Reset usage if period has rolled over
    let usage = user.monthlyUsage || { paystubsCreated: 0, w2sCreated: 0 };
    if (user.subscription?.currentPeriodStart && usage.periodStart) {
      const periodStart = new Date(user.subscription.currentPeriodStart).getTime();
      const usagePeriod = new Date(usage.periodStart).getTime();
      if (periodStart > usagePeriod) {
        usage = { paystubsCreated: 0, w2sCreated: 0, periodStart: user.subscription.currentPeriodStart };
        await User.findByIdAndUpdate(req.userId, { monthlyUsage: usage });
      }
    }

    return res.json({
      plan,
      status,
      cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
      currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
      limits: {
        paystubs: config.paystubs,
        w2s: config.w2s,
        payPeriods: config.payPeriods,
      },
      usage: {
        paystubsCreated: usage.paystubsCreated || 0,
        w2sCreated: usage.w2sCreated || 0,
      },
      label: config.label,
    });
  } catch (err) {
    console.error("[Subscription] status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /checkout — Create Stripe Checkout Session ────────────────────────
router.post("/checkout", auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const priceMap = {
      starter: process.env.STRIPE_PRICE_STARTER,
      professional: process.env.STRIPE_PRICE_PROFESSIONAL,
      unlimited: process.env.STRIPE_PRICE_UNLIMITED,
    };
    const priceId = priceMap[plan];
    if (!priceId) return res.status(400).json({ message: "Invalid plan" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure user has a Stripe customer ID
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${FRONTEND_URL}/pricing?subscription=canceled`,
      metadata: { userId: user._id.toString(), plan },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("[Subscription] checkout error:", err.message);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
});

// ─── POST /portal — Stripe Customer Portal (manage billing) ────────────────
router.post("/portal", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ message: "No billing account found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${FRONTEND_URL}/dashboard`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("[Subscription] portal error:", err.message);
    res.status(500).json({ message: "Failed to open billing portal" });
  }
});

// ─── POST /cancel — Cancel subscription at period end ───────────────────────
router.post("/cancel", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const subId = user?.subscription?.stripeSubscriptionId;
    if (!subId) return res.status(400).json({ message: "No active subscription" });

    await stripe.subscriptions.update(subId, { cancel_at_period_end: true });

    await User.findByIdAndUpdate(req.userId, {
      "subscription.cancelAtPeriodEnd": true,
    });

    return res.json({ message: "Subscription will cancel at end of billing period" });
  } catch (err) {
    console.error("[Subscription] cancel error:", err.message);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
});

module.exports = router;
module.exports.PLAN_CONFIG = PLAN_CONFIG;
module.exports.PRICE_TO_PLAN = PRICE_TO_PLAN;
