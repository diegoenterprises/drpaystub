const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const roleCheck = require("../middlewares/roleCheck");
const { User } = require("../models/user");
const Paystub = require("../models/Paystub");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE } = process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);

// ─── Admin Login (standalone — bypasses email verification) ─────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 400, message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({ status: 404, message: "Invalid credentials" });
    }
    if (user.role !== "admin") {
      return res.status(200).json({ status: 403, message: "Access denied" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ status: 400, message: "Invalid credentials" });
    }
    const tokens = jwt.sign(
      { payload: { user: user._id, role: user.role } },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      status: 200,
      message: "Admin login successful",
      data: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
      tokens,
    });
  } catch (err) {
    console.error("[Admin] login error:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

// ─── Quick DB health check (no auth — for debugging) ────────────────────────
router.get("/health", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const paystubCount = await Paystub.countDocuments();
    res.json({ ok: true, users: userCount, paystubs: paystubCount, ts: new Date().toISOString() });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ─── Admin Dashboard Stats (comprehensive KPIs — Cosmos DB compatible) ──────
router.get("/stats", auth(), roleCheck("admin"), async (req, res) => {
  try {
    const now = new Date();
    console.log("[Admin] Fetching stats (Cosmos DB safe)...");

    // ── Fetch ALL users & paystubs in two queries (no .sort / no date filter) ──
    // This avoids Cosmos DB "order-by index excluded" errors entirely.
    const allUsersRaw = await User.find()
      .select("firstName lastName email role isEmailVerified createdAt").lean();
    const allStubsRaw = await Paystub.find().lean();

    // ── Sort in JS ──
    allUsersRaw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    allStubsRaw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // ── Date boundaries ──
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday); startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfWeek); startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Helper: count items in date range
    const inRange = (arr, from, to) => arr.filter((d) => {
      const t = new Date(d.createdAt).getTime();
      return t >= from.getTime() && (!to || t <= to.getTime());
    }).length;

    // ── User KPIs (computed from allUsersRaw in JS) ──
    const totalUsers = allUsersRaw.length;
    const verifiedUsers = allUsersRaw.filter((u) => u.isEmailVerified).length;
    const adminUsers = allUsersRaw.filter((u) => u.role === "admin").length;
    const verificationRate = totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

    const newUsersToday = inRange(allUsersRaw, startOfToday);
    const newUsersYesterday = inRange(allUsersRaw, startOfYesterday, startOfToday);
    const newUsersThisWeek = inRange(allUsersRaw, startOfWeek);
    const newUsersLastWeek = inRange(allUsersRaw, startOfLastWeek, startOfWeek);
    const newUsersThisMonth = inRange(allUsersRaw, startOfMonth);
    const newUsersLastMonth = inRange(allUsersRaw, startOfLastMonth, endOfLastMonth);
    const newUsersLast24h = inRange(allUsersRaw, last24h);
    const newUsersLast7d = inRange(allUsersRaw, last7d);
    const newUsersLast30d = inRange(allUsersRaw, last30d);

    // ── Paystub KPIs (computed from allStubsRaw in JS) ──
    const totalPaystubs = allStubsRaw.length;
    const paidStubs = allStubsRaw.filter((p) => p.params?.paymentStatus === "success");
    const paidPaystubs = paidStubs.length;

    const paystubsToday = inRange(allStubsRaw, startOfToday);
    const paystubsYesterday = inRange(allStubsRaw, startOfYesterday, startOfToday);
    const paystubsThisWeek = inRange(allStubsRaw, startOfWeek);
    const paystubsLastWeek = inRange(allStubsRaw, startOfLastWeek, startOfWeek);
    const paystubsThisMonth = inRange(allStubsRaw, startOfMonth);
    const paystubsLastMonth = inRange(allStubsRaw, startOfLastMonth, endOfLastMonth);
    const paidThisMonth = paidStubs.filter((p) => new Date(p.createdAt) >= startOfMonth).length;
    const paidLastMonth = paidStubs.filter((p) => {
      const t = new Date(p.createdAt);
      return t >= startOfLastMonth && t <= endOfLastMonth;
    }).length;
    const conversionRate = totalPaystubs > 0 ? Math.round((paidPaystubs / totalPaystubs) * 100) : 0;
    const avgPaystubsPerUser = totalUsers > 0 ? (totalPaystubs / totalUsers).toFixed(1) : "0";

    // ── Recent activity (already sorted) ──
    const recentPaystubs = paidStubs.slice(0, 15);
    const recentUsers = allUsersRaw.slice(0, 20);

    // ── Monthly trends (last 12 months — computed in JS from arrays) ──
    const monthlyUsers = [];
    const monthlyPaystubs = [];
    const monthlyPaid = [];
    for (let i = 11; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = mStart.toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyUsers.push({ label, count: inRange(allUsersRaw, mStart, mEnd) });
      monthlyPaystubs.push({ label, count: inRange(allStubsRaw, mStart, mEnd) });
      monthlyPaid.push({ label, count: inRange(paidStubs, mStart, mEnd) });
    }

    // ── Daily trend (last 14 days) ──
    const dailySignups = [];
    const dailyPaystubs = [];
    for (let i = 13; i >= 0; i--) {
      const dStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
      const label = dStart.toLocaleString("default", { month: "short", day: "numeric" });
      dailySignups.push({ label, count: inRange(allUsersRaw, dStart, dEnd) });
      dailyPaystubs.push({ label, count: inRange(paidStubs, dStart, dEnd) });
    }

    console.log("[Admin] Stats OK — users:", totalUsers, "paystubs:", totalPaystubs);

    res.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
        admins: adminUsers,
        verificationRate,
        newToday: newUsersToday,
        newYesterday: newUsersYesterday,
        newThisWeek: newUsersThisWeek,
        newLastWeek: newUsersLastWeek,
        newThisMonth: newUsersThisMonth,
        newLastMonth: newUsersLastMonth,
        newLast24h: newUsersLast24h,
        newLast7d: newUsersLast7d,
        newLast30d: newUsersLast30d,
      },
      paystubs: {
        total: totalPaystubs,
        paid: paidPaystubs,
        unpaid: totalPaystubs - paidPaystubs,
        conversionRate,
        avgPerUser: avgPaystubsPerUser,
        today: paystubsToday,
        yesterday: paystubsYesterday,
        thisWeek: paystubsThisWeek,
        lastWeek: paystubsLastWeek,
        thisMonth: paystubsThisMonth,
        lastMonth: paystubsLastMonth,
        paidThisMonth,
        paidLastMonth,
      },
      recentPaystubs: recentPaystubs.map((p) => ({
        _id: p._id,
        company: p.params?.company_name || "—",
        employee: p.params?.employee_name || "—",
        periods: (p.params?.pay_dates || []).length,
        amount: p.params?.net_pay || p.params?.gross_pay || null,
        state: p.params?.state || "—",
        createdAt: p.createdAt,
      })),
      recentUsers,
      allUsers: allUsersRaw,
      trends: { monthlyUsers, monthlyPaystubs, monthlyPaid, dailySignups, dailyPaystubs },
      stripeMode: STRIPE_MODE || "unknown",
      serverTime: now.toISOString(),
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
