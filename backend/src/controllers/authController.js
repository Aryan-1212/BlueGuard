import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeMessage, sendVerificationCode, validatePhoneNumber } from "../services/twilioService.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, number } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Check if phone number already exists
    let existingPhone = await User.findOne({ number });
    if (existingPhone) return res.status(400).json({ message: "Phone number already registered" });

    // Validate phone number format
    if (!validatePhoneNumber(number)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with verification code
    user = await User.create({ 
      name, 
      email, 
      password, 
      number,
      verificationCode,
      verificationCodeExpires
    });

    // Send welcome SMS with verification code
    try {
      await sendVerificationCode(number, verificationCode);
      console.log(`✅ Verification code sent to ${number}`);
    } catch (smsError) {
      console.error(`❌ Failed to send SMS: ${smsError.message}`);
      // Don't fail registration if SMS fails, but log it
    }

    res.status(200).json({ 
      message: "User registered successfully. Please check your phone for verification code.",
      requiresVerification: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password);
    console.log(user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Verify phone number with verification code
 */
export const verifyPhone = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      return res.status(400).json({ message: "Phone number already verified" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Mark phone as verified and clear verification code
    user.phoneVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Send welcome message
    try {
      await sendWelcomeMessage(user.number, user.name);
      console.log(`✅ Welcome message sent to ${user.number}`);
    } catch (smsError) {
      console.error(`❌ Failed to send welcome SMS: ${smsError.message}`);
    }

    res.status(200).json({ 
      message: "Phone number verified successfully! Welcome message sent.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Resend verification code
 */
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      return res.status(400).json({ message: "Phone number already verified" });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send new verification code
    try {
      await sendVerificationCode(user.number, verificationCode);
      console.log(`✅ New verification code sent to ${user.number}`);
    } catch (smsError) {
      console.error(`❌ Failed to send verification SMS: ${smsError.message}`);
      return res.status(500).json({ message: "Failed to send verification code" });
    }

    res.status(200).json({ 
      message: "New verification code sent successfully",
      expiresIn: "10 minutes"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};