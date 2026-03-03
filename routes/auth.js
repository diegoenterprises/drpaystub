const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const roleCheck = require("../middlewares/roleCheck");
const { authService, tokenService, emailService } = require("../services");
const upload = require("../middlewares/upload");
const Paystub = require("../models/Paystub");

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res
      .status(200)
      .json({ status: 404, message: "User not found!", data: {} });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res
      .status(200)
      .json({ status: 400, message: "Incorrect Password!", data: {} });
  }
  if (user.isEmailVerified === false) {
    return res.status(200).json({
      status: 404,
      message: "Please verify your email!",
      data: {},
    });
  }
  const tokens = jwt.sign(
    { payload: { user: user._id, role: user.role || "user" } },
    process.env.JWT_SECRET
  );
  return res
    .status(200)
    .json({ status: 200, message: "Login successfully", data: user, tokens });
});
router.post("/register", async (req, res, next) => {
  const findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    return res
      .status(200)
      .json({ status: 400, message: "Email already exists" });
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }

  const user = await User.create(req.body);

  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await User.findOneAndUpdate(
    { _id: user._id },
    { verifyEmailToken: verifyEmailToken },
    { new: true }
  );
  await emailService.sendVerificationEmail(req.body.email, verifyEmailToken);

  return res
    .status(200)
    .json({ status: 200, message: "Register successfully", data: user });
});

router.put("/update-admin-user/:id", auth(), roleCheck("admin"), async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  const update = await User.findOneAndUpdate({ _id: user._id }, req.body, {
    new: true,
  });
  res.status(200).send({
    status: 200,
    message: "Update user successfully",
    data: update,
  });
});

router.put("/change-user-password/:id", auth(), roleCheck("admin"), async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findOne({ _id: req.params.id });

    const hashedNewPassword = await bcrypt.hash(password, 8);

    user.password = hashedNewPassword;
    await user.save();

  await emailService.changePasswordEmail(user.email, password);

  res.status(200).send({
    status: 200,
    message: "Password changed successfully",
    data: user,
  });
});

router.delete("/delete-admin-user/:id", auth(), roleCheck("admin"), async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  const update = await User.findOneAndDelete({ _id: user._id });
  res.status(200).send({
    status: 200,
    message: "User Deleted successfully",
    data: update,
  });
});

router.post("/send-verification-email", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await User.findOneAndUpdate(
    { _id: user._id },
    { verifyEmailToken: verifyEmailToken },
    { new: true }
  );
  await emailService.sendVerificationEmail(req.body.email, verifyEmailToken);
  res.status(200).send({
    status: 200,
    message: `Email verification link send to your ${req.body.email}. Please check.`,
    data: `Token=${verifyEmailToken}`,
  });
});

router.get("/verify-email", async (req, res, next) => {
  const user = await User.findOne({ verifyEmailToken: req.query.token });

  if (user?.verifyEmailToken) {
    const data = await User.findOneAndUpdate(
      { _id: user._id },
      { $unset: { verifyEmailToken: "" }, $set: { isEmailVerified: true } },
      { new: true }
    );
    await authService.verifyEmail(req.query.token);
    // res
    //   .status(200)
    //   .send({ status: 200, message: "Email verified successfully" });
    const redirectUrl = `${process.env.FRONTEND_URL}/success`;
    return res.redirect(redirectUrl);
  } else {
    // res
    //   .status(400)
    //   .send({ status: 400, error: "Verified email token expired" });
    const redirectUrl = `${process.env.FRONTEND_URL}/failure`;
    return res.redirect(redirectUrl);
  }
});

router.put("/update-user", auth(), async (req, res, next) => {
  const userId = req.user;

  // Check if the user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return res
      .status(404)
      .json({ status: 404, message: "User not found!", data: {} });
  }

  if (req.body.email) {
    const emailExists = await User.findOne({
      email: req.body.email,
      _id: { $ne: existingUser._id },
    });
    if (emailExists) {
      return res.status(200).json({
        status: 400,
        message: "Email already exists. Choose a different email.",
        data: {},
      });
    }
  }

  // Update the user
  const updateUser = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  return res
    .status(200)
    .json({ status: 200, message: "Update successful", data: updateUser });
});

router.get("/get-user", auth(), async (req, res, next) => {
  const findUser = await User.findOne({ _id: req.user });
  return res.status(200).json(findUser);
});

router.get("/get-paystub/:id", async (req, res, next) => {
  const findUser = await Paystub.findOne({ _id: req.params.id });
  return res.status(200).json(findUser);
});

router.get("/get-user/:id", async (req, res, next) => {
  const findUser = await User.findOne({ _id: req.params.id });
  return res.status(200).json(findUser);
});

router.get("/get-paystubs", auth(), async (req, res, next) => {
  const findUser = await Paystub.find({
    "params.userId": req.user._id.toString(),
    "params.paymentStatus": "success",
  });
  return res.status(200).json(findUser);
});
router.get("/get-admin-paystubs", auth(), roleCheck("admin"), async (req, res, next) => {
  const perPage = 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const searchKey = req.query.searchKey;

  let query = {};

  if (req.query.type) {
    query.type = new RegExp(req.query.type, "i");
  }

  if (searchKey) {
    query.$or = [{ name: new RegExp(searchKey, "i") }];
  }

  const totalCount = await Paystub.countDocuments(query);
  const search = await Paystub.find(query)
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort("-createdAt");

  return res.status(200).json({
    status: 200,
    message: "List of Paystubs",
    data: search,
    page: page,
    totalPages: Math.ceil(totalCount / perPage),
    count: search.length,
  });
});

router.get("/get-all-users", auth(), roleCheck("admin"), async (req, res, next) => {
  const perPage = 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const searchKey = req.query.searchKey;

  let query = {};

  if (req.query.type) {
    query.type = new RegExp(req.query.type, "i");
  }

  if (searchKey) {
    query.$or = [{ name: new RegExp(searchKey, "i") }];
  }

  const totalCount = await User.countDocuments(query);
  const search = await User.find(query)
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort("-createdAt");

  return res.status(200).json({
    status: 200,
    message: "List of Users",
    data: search,
    page: page,
    totalPages: Math.ceil(totalCount / perPage),
    count: search.length,
  });
});

router.post("/forgot-password", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const update = await User.findOne({ email: req.body.email });
    const resetPasswordToken = await tokenService.generateResetPasswordToken(
      req.body.email
    );
    if (update) {
      user.resetPasswordToken = resetPasswordToken;
      user.save();
      await emailService.sendResetPasswordEmail(
        req.body.email,
        user.resetPasswordToken
      );
      res.status(200).send({
        status: 200,
        message: "Email successfully sent to the given email address!",
      });
    }
  } else {
    res.status(200).send({ status: 200, message: "Email not found!" });
  }
});

router.post("/reset-password", async (req, res, next) => {
  const user = await User.findOne({ email: req.query.email });
  if (!user.resetPasswordToken) {
    return res
      .status(404)
      .send({ status: 200, message: "Reset password token expired!" });
  }
  if (!user) {
    return res.status(404).send({ message: "User Not Found!" });
  } else {
    const data = await User.findOneAndUpdate(
      { _id: user._id },
      { $unset: { resetPasswordToken: "" } },
      { new: true }
    );
    await authService.resetPassword(req.query.email, req.body.password);
    return res.status(200).send({
      status: 200,
      message: `User's new password is ${req.body.password}`,
    });
  }
});

router.post("/change-password", auth(), async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: req.user });

  if (!user) {
    return res.status(404).send({ status: 200, message: "User Not Found!" });
  }

  // Check if the old password matches the stored hashed password
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!passwordMatch) {
    return res
      .status(200)
      .send({ status: 200, message: "Incorrect old password!" });
  }

  // Hash the new password before storing it in the database
  const hashedNewPassword = await bcrypt.hash(newPassword, 8);

  // Update the user's password in the database
  user.password = hashedNewPassword;
  await user.save();

  res
    .status(200)
    .send({ status: 200, message: "Password updated successfully!" });
});

router.post("/upload", upload.single("file"), async (req, res, next) => {
  if (req.file) {
    const data = `${process.env.URL}/${req.file.filename}`;
    return res.status(200).json({
      status: 200,
      message: "Image upload successfully",
      url: data,
    });
  }
  return res.status(400).json({
    status: 400,
    message: "File does'nt exist",
    data: {},
  });
});

module.exports = router;
