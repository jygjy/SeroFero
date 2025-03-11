const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("🔍 Incoming Request:", req.method, req.url);
  console.log("📨 Headers:", req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or Invalid Authorization Header:", authHeader);
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔍 Received Token:", token);

  try {
    console.log("🔍 Using JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
