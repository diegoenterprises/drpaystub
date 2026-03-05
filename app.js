global.fetch = require("node-fetch");
process.setMaxListeners(Infinity);
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./db");
const cors = require("cors");
const fs = require("fs");
const { logo: watermark } = require("./config/logo");
const moment = require("moment");

app.use(logger("dev"));
app.set("view engine", "ejs");

app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  express.json({
    extended: false,
    limit: "50mb",
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));

app.use(express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/sendmails", require("./routes/sendmails"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api/paystub", require("./routes/paystub"));
app.use("/api/states", require("./routes/states"));
app.use("/api/w2", require("./routes/w2"));
app.use("/api/w2/cache", require("./routes/cache"));
app.use("/api/shopify/webhook", require("./routes/webhooks"));
app.use("/api/stripe/webhook", require("./routes/stripe-webhook"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html")); // relative path
});

const port = process.env.PORT || 5000;

var dir = "./public";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

(async () => {
  await connectDB();

  // ─── Seed admin user ────────────────────────────────────────────────────────
  try {
    const { User } = require("./models/user");
    const bcrypt = require("bcryptjs");
    const adminEmail = "diegousoro@gmail.com";
    const adminPass = "EsangVision2027!";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(adminPass, 8);
      admin = await User.create({
        firstName: "Diego",
        lastName: "Usoro",
        email: adminEmail,
        password: hashed,
        role: "admin",
        isEmailVerified: true,
      });
      console.log("[Seed] Admin user created");
    } else {
      const needsUpdate = {};
      if (admin.role !== "admin") needsUpdate.role = "admin";
      if (!admin.isEmailVerified) needsUpdate.isEmailVerified = true;
      const passMatch = await bcrypt.compare(adminPass, admin.password);
      if (!passMatch) needsUpdate.password = await bcrypt.hash(adminPass, 8);
      if (Object.keys(needsUpdate).length > 0) {
        await User.findByIdAndUpdate(admin._id, needsUpdate);
        console.log("[Seed] Admin user updated:", Object.keys(needsUpdate).join(", "));
      }
    }
  } catch (seedErr) {
    console.error("[Seed] Admin seed error:", seedErr.message);
  }

  // Initialize monthly tax data auditor
  try {
    const { initTaxDataFetcher } = require("./services/tax-data-fetcher");
    initTaxDataFetcher();
  } catch (fetcherErr) {
    console.error("[TaxDataFetcher] Init error:", fetcherErr.message);
  }

  app.listen(port, async () => {
    console.log(`Server Running on port: ${port}`);
  });
})();
