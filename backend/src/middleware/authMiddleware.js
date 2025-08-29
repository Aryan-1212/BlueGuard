import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // ✅ Case 1: Google OAuth (passport attaches req.user)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // ✅ Case 2: JWT Auth
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
};
