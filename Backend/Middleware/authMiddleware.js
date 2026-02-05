const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Check for user token first
    const userToken = req.cookies.jwt;
    const adminToken = req.cookies.jwtAdmin;

    if (!userToken && !adminToken) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    // Prioritize user token if both exist
    if (userToken) {
      try {
        const decoded = jwt.verify(userToken, process.env.JWT_ADMIN);
        req.userId = decoded.id;
        req.isAdmin = false;
        return next();
      } catch (err) {
        // User token invalid, try admin token
        console.log("User token invalid, checking admin token");
      }
    }

    // Check if admin token exists and is valid
    if (adminToken) {
      const decoded = jwt.verify(adminToken, process.env.ADMIN_PASS);
      req.isAdmin = true;
      req.adminName = decoded.name;
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
