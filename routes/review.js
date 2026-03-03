const express = require("express");
const router = express.Router();

const { ReviewModel } = require("../models/reviews");

router.get("/", async (req, res, next) => {
  const reviews = await ReviewModel.find({ rating: { $gt: 2 } });
  return res.json({
    reviews,
    success: true,
  });
});

router.post("/", async (req, res, next) => {
  const { product, customer_name, customer_email, description, rating } =
    req.body;

  const review = await new ReviewModel({
    product,
    customer_name,
    customer_email,
    description,
    rating,
  }).save();

  return res.json({
    review,
    success: true,
  });
});

module.exports = router;
