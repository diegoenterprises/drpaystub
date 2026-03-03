const express = require("express");
const router = express.Router();
require("dotenv").config();

const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE, STRIPE_WEBHOOK_SECRET } =
  process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);

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
      // No webhook secret configured — parse event from body directly
      event = req.body;
    }
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific event types
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(
        `[Stripe] PaymentIntent ${paymentIntent.id} succeeded — $${(
          paymentIntent.amount / 100
        ).toFixed(2)}`
      );
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      console.log(
        `[Stripe] PaymentIntent ${failedIntent.id} failed:`,
        failedIntent.last_payment_error?.message
      );
      break;

    case "charge.succeeded":
      const charge = event.data.object;
      console.log(
        `[Stripe] Charge ${charge.id} succeeded — $${(
          charge.amount / 100
        ).toFixed(2)}`
      );
      break;

    case "charge.refunded":
      const refund = event.data.object;
      console.log(`[Stripe] Charge ${refund.id} refunded`);
      break;

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
