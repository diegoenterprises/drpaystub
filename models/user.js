const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: "Email address is required",
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: String,
    resetPasswordToken: String,
    image: String,
    geo: {
      ip: String,
      city: String,
      region: String,
      country: String,
      countryCode: String,
      lat: Number,
      lng: Number,
      timezone: String,
      isp: String,
      lastUpdated: Date,
    },
  },
  { timestamps: true }
);

module.exports.User = mongoose.model("User", UserSchema);
