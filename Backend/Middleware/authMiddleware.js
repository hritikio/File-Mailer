const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Check for user token first
    const userToken = req.cookies.jwt;
    const adminToken = req.cookies.jwtAdmin;

    console.log(
      "Cookies received - userToken:",
      !!userToken,
      "adminToken:",
      !!adminToken,
    );

    if (!userToken && !adminToken) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    // Prioritize admin token if it exists
    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, process.env.ADMIN_PASS);
        req.isAdmin = true;
        req.adminName = decoded.name;
        console.log("Admin authenticated:", decoded.name, "isAdmin:", true);
        return next();
      } catch (err) {
        console.log("Admin token invalid:", err.message);
      }
    }

    // Check user token if admin token doesn't exist or is invalid
    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.JWT_ADMIN);
      req.userId = decoded.id;
      req.isAdmin = false;
      console.log("User authenticated:", decoded.id, "isAdmin:", false);
      return next();
    }

    // If we reach here, no valid token was found
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  } catch (err) {
    console.log("Authentication error:", err);
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
      error: err.message,
    });
  }
};

module.exports = authMiddleware;
