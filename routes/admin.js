const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const roleCheck = require("../middlewares/roleCheck");
const { User } = require("../models/user");
const Paystub = require("../models/Paystub");
require("dotenv").config();

const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE } = process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);

// ─── Admin Dashboard Stats ──────────────────────────────────────────────────
router.get("/stats", auth(), roleCheck("admin"), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // User stats
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Paystub stats
    const totalPaystubs = await Paystub.countDocuments();
    const paidPaystubs = await Paystub.countDocuments({ "params.paymentStatus": "success" });
    const paystubsThisMonth = await Paystub.countDocuments({ createdAt: { $gte: startOfMonth } });
    const paystubsLastMonth = await Paystub.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const paystubsThisWeek = await Paystub.countDocuments({ createdAt: { $gte: startOfWeek } });

    // Recent paystubs (last 10)
    const recentPaystubs = await Paystub.find({ "params.paymentStatus": "success" })
      .sort("-createdAt")
      .limit(10)
      .lean();

    // Recent users (last 10)
    const recentUsers = await User.find()
      .select("firstName lastName email role isEmailVerified createdAt")
      .sort("-createdAt")
      .limit(10)
      .lean();

    // Monthly paystub counts for last 6 months (for chart)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = await Paystub.countDocuments({
        "params.paymentStatus": "success",
        createdAt: { $gte: mStart, $lte: mEnd },
      });
      monthlyData.push({
        label: mStart.toLocaleString("default", { month: "short", year: "numeric" }),
        count,
      });
    }

    res.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
        newThisMonth: newUsersThisMonth,
        newLastMonth: newUsersLastMonth,
      },
      paystubs: {
        total: totalPaystubs,
        paid: paidPaystubs,
        unpaid: totalPaystubs - paidPaystubs,
        thisMonth: paystubsThisMonth,
        lastMonth: paystubsLastMonth,
        thisWeek: paystubsThisWeek,
      },
      recentPaystubs: recentPaystubs.map((p) => ({
        _id: p._id,
        company: p.params?.company_name || "—",
        employee: p.params?.employee_name || "—",
        periods: (p.params?.pay_dates || []).length,
        createdAt: p.createdAt,
      })),
      recentUsers,
      monthlyData,
      stripeMode: STRIPE_MODE || "unknown",
    });
  } catch (err) {
    console.error("[Admin] stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Stripe Revenue Summary ─────────────────────────────────────────────────
router.get("/stripe-revenue", auth(), roleCheck("admin"), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
    const startOfLastMonth = Math.floor(new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() / 1000);
    const endOfLastMonth = Math.floor(new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).getTime() / 1000);

    // Fetch recent charges from Stripe
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;
    let totalCharges = 0;
    let recentCharges = [];

    try {
      // This month's charges
      const thisMonthChargesList = await stripe.charges.list({
        created: { gte: startOfMonth },
        limit: 100,
      });
      thisMonthRevenue = thisMonthChargesList.data
        .filter((c) => c.paid && !c.refunded)
        .reduce((sum, c) => sum + c.amount, 0);
      totalCharges = thisMonthChargesList.data.filter((c) => c.paid).length;

      // Last month's charges
      const lastMonthChargesList = await stripe.charges.list({
        created: { gte: startOfLastMonth, lte: endOfLastMonth },
        limit: 100,
      });
      lastMonthRevenue = lastMonthChargesList.data
        .filter((c) => c.paid && !c.refunded)
        .reduce((sum, c) => sum + c.amount, 0);

      // Recent 10 charges
      const recentList = await stripe.charges.list({ limit: 10 });
      recentCharges = recentList.data.map((c) => ({
        id: c.id,
        amount: c.amount,
        currency: c.currency,
        status: c.status,
        paid: c.paid,
        refunded: c.refunded,
        email: c.billing_details?.email || c.receipt_email || "—",
        description: c.description || "—",
        created: new Date(c.created * 1000).toISOString(),
      }));
    } catch (stripeErr) {
      console.error("[Admin] Stripe API error:", stripeErr.message);
    }

    // Stripe balance
    let balance = { available: 0, pending: 0 };
    try {
      const bal = await stripe.balance.retrieve();
      balance.available = bal.available.reduce((s, b) => s + b.amount, 0);
      balance.pending = bal.pending.reduce((s, b) => s + b.amount, 0);
    } catch (e) {
      console.error("[Admin] Stripe balance error:", e.message);
    }

    res.json({
      thisMonthRevenue,
      lastMonthRevenue,
      totalChargesThisMonth: totalCharges,
      balance,
      recentCharges,
      stripeMode: STRIPE_MODE || "unknown",
    });
  } catch (err) {
    console.error("[Admin] stripe-revenue error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
