const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 401, message: "Not authenticated" });
    }
    const userRole = req.user.role || "user";
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ status: 403, message: "Access denied. Insufficient permissions." });
    }
    return next();
  };
};

module.exports = roleCheck;
