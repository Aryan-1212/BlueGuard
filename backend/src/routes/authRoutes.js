import express from "express";
import passport from "passport";
import { registerUser, loginUser, verifyPhone, resendVerificationCode } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-phone", verifyPhone);
router.post("/resend-verification", resendVerificationCode);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  (req, res) => {
    req.session.isGoogleAuth = true;
    console.log("Google OAuth successful, user:", req.user);
    res.redirect("http://localhost:3000/dashboard"); 
  }
);


router.post("/logout", (req, res) => {
  if (req.logout) {
    req.logout(() => {
      req.session?.destroy(() => {
        res.json({ message: "Logged out successfully" });
      });
    });
  } else {
    res.json({ message: "Logged out successfully" });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.get("/google/status", (req, res) => {
  console.log("Checking Google OAuth status:", {
    isAuthenticated: req.isAuthenticated(),
    session: req.session,
    user: req.user
  });
  
  if (req.isAuthenticated && req.session.isGoogleAuth) {
    res.json({ 
      authenticated: true, 
      user: req.user,
      isGoogleAuth: true 
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

router.get("/test-session", (req, res) => {
  res.json({
    session: req.session,
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

export default router;
