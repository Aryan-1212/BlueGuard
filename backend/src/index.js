import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/db.js";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import threatRoutes from "./routes/threatRoutes.js";
import  errorHandler  from "./middleware/errorHandler.js";
import { getMe } from "./controllers/authController.js";


connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,               
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "hackathonsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
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
app.use("/api", aiRoutes);
app.use("/api/threats", threatRoutes);
app.get("/me", getMe);
// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
