const Token = require("../models/token");
const { tokenTypes } = require("../config/tokens");
const { User } = require("../models/user");
const { tokenService } = require(".");
const bcrypt = require("bcryptjs");

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await User.findOne({
      verifyEmailToken: verifyEmailTokenDoc.user,
    });
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await User.findByIdAndUpdate(user.id, { isEmailVerified: true });
  } catch (error) {
    return 401, "Email verification failed";
  }
};

const resetPassword = async (email, newPassword) => {
  try {
    // const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error();
    }
    await User.findByIdAndUpdate(user.id, {
      password: await bcrypt.hash(newPassword, 8),
    });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    return 401, "Password reset failed";
  }
};

module.exports = {
  verifyEmail,
  resetPassword,
};
