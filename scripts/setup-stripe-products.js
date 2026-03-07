require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);

async function setup() {
  console.log("[Stripe] Creating subscription products...");

  const starter = await stripe.products.create({
    name: "Saurellius Starter",
    description: "5 paystub groups/month, up to 6 pay periods each, standard templates",
  });
  const starterPrice = await stripe.prices.create({
    product: starter.id,
    unit_amount: 5000,
    currency: "usd",
    recurring: { interval: "month" },
  });
  console.log("Starter:", starterPrice.id);

  const pro = await stripe.products.create({
    name: "Saurellius Professional",
    description: "15 paystub groups/month, up to 12 pay periods, all templates, 2 W-2s/month, priority support",
  });
  const proPrice = await stripe.prices.create({
    product: pro.id,
    unit_amount: 7500,
    currency: "usd",
    recurring: { interval: "month" },
  });
  console.log("Professional:", proPrice.id);

  const unlimited = await stripe.products.create({
    name: "Saurellius Unlimited",
    description: "Unlimited paystubs, unlimited pay periods, all templates, unlimited W-2s, priority support",
  });
  const unlimitedPrice = await stripe.prices.create({
    product: unlimited.id,
    unit_amount: 15000,
    currency: "usd",
    recurring: { interval: "month" },
  });
  console.log("Unlimited:", unlimitedPrice.id);

  console.log("\n--- Add these to your .env ---");
  console.log(`STRIPE_PRICE_STARTER=${starterPrice.id}`);
  console.log(`STRIPE_PRICE_PROFESSIONAL=${proPrice.id}`);
  console.log(`STRIPE_PRICE_UNLIMITED=${unlimitedPrice.id}`);
}

setup().catch((e) => { console.error(e.message); process.exit(1); });
