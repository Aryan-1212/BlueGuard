import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/db.js";
import "./config/passport.js"; // <-- import passport config
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import  errorHandler  from "./middleware/errorHandler.js";
import { getMe } from "./controllers/authController.js";


connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,               // allow cookies/session
  })
);
app.use(express.json());

// Session setup - improved for Google OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hackathonsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
    name: 'blueguard.sid'
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", aiRoutes);
app.get("/me", getMe);
// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
