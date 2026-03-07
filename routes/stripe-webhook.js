const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
require("dotenv").config();

const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE, STRIPE_WEBHOOK_SECRET } =
  process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);

// Price ID → plan name mapping
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_STARTER]: "starter",
  [process.env.STRIPE_PRICE_PROFESSIONAL]: "professional",
  [process.env.STRIPE_PRICE_UNLIMITED]: "unlimited",
};

// Find user by Stripe customer ID
async function findUserByCustomer(customerId) {
  return User.findOne({ stripeCustomerId: customerId });
}

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = req.body;
    }
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific event types
  switch (event.type) {
    // ─── Subscription paid (new or renewal) ───────────────────────────────
    case "invoice.paid": {
      const invoice = event.data.object;
      if (invoice.subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription);
          const user = await findUserByCustomer(invoice.customer);
          if (user) {
            const priceId = sub.items.data[0]?.price?.id;
            const plan = PRICE_TO_PLAN[priceId] || "free";
            await User.findByIdAndUpdate(user._id, {
              "subscription.plan": plan,
              "subscription.stripeSubscriptionId": sub.id,
              "subscription.stripePriceId": priceId,
              "subscription.status": sub.status,
              "subscription.currentPeriodStart": new Date(sub.current_period_start * 1000),
              "subscription.currentPeriodEnd": new Date(sub.current_period_end * 1000),
              "subscription.cancelAtPeriodEnd": sub.cancel_at_period_end,
              "monthlyUsage.paystubsCreated": 0,
              "monthlyUsage.w2sCreated": 0,
              "monthlyUsage.periodStart": new Date(sub.current_period_start * 1000),
            });
            console.log(`[Stripe] Subscription ${plan} activated for ${user.email}`);
          }
        } catch (e) {
          console.error("[Stripe] invoice.paid handler error:", e.message);
        }
      }
      break;
    }

    // ─── Subscription updated (upgrade/downgrade/renewal) ─────────────────
    case "customer.subscription.updated": {
      const sub = event.data.object;
      try {
        const user = await findUserByCustomer(sub.customer);
        if (user) {
          const priceId = sub.items.data[0]?.price?.id;
          const plan = PRICE_TO_PLAN[priceId] || "free";
          const update = {
            "subscription.plan": plan,
            "subscription.stripePriceId": priceId,
            "subscription.status": sub.status,
            "subscription.currentPeriodStart": new Date(sub.current_period_start * 1000),
            "subscription.currentPeriodEnd": new Date(sub.current_period_end * 1000),
            "subscription.cancelAtPeriodEnd": sub.cancel_at_period_end,
          };
          // If canceled or unpaid, revert to free
          if (sub.status === "canceled" || sub.status === "unpaid") {
            update["subscription.plan"] = "free";
          }
          await User.findByIdAndUpdate(user._id, update);
          console.log(`[Stripe] Subscription updated → ${plan} (${sub.status}) for ${user.email}`);
        }
      } catch (e) {
        console.error("[Stripe] subscription.updated handler error:", e.message);
      }
      break;
    }

    // ─── Subscription deleted (canceled and expired) ──────────────────────
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      try {
        const user = await findUserByCustomer(sub.customer);
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            "subscription.plan": "free",
            "subscription.status": "canceled",
            "subscription.cancelAtPeriodEnd": false,
            "subscription.stripeSubscriptionId": null,
            "subscription.stripePriceId": null,
          });
          console.log(`[Stripe] Subscription canceled → free for ${user.email}`);
        }
      } catch (e) {
        console.error("[Stripe] subscription.deleted handler error:", e.message);
      }
      break;
    }

    // ─── Payment events (existing) ────────────────────────────────────────
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(
        `[Stripe] PaymentIntent ${paymentIntent.id} succeeded — $${(
          paymentIntent.amount / 100
        ).toFixed(2)}`
      );
      break;
    }

    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object;
      console.log(
        `[Stripe] PaymentIntent ${failedIntent.id} failed:`,
        failedIntent.last_payment_error?.message
      );
      break;
    }

    case "charge.succeeded": {
      const charge = event.data.object;
      console.log(
        `[Stripe] Charge ${charge.id} succeeded — $${(
          charge.amount / 100
        ).toFixed(2)}`
      );
      break;
    }

    case "charge.refunded": {
      const refund = event.data.object;
      console.log(`[Stripe] Charge ${refund.id} refunded`);
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
