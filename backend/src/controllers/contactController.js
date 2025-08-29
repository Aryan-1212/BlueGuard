import { sendEmail } from "../utils/nodemailer.js";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
export const contactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Send email to your admin inbox
    const response = await sendEmail(
      process.env.EMAIL_USER,
      `New Contact Form Message from ${name}`,
      `Message: ${message}\nFrom: ${email}`,
      `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`
    );

    if (response.success) {
      res.json({ message: "Message sent successfully!" });
    } else {
      res.status(500).json({ message: "Failed to send message" });
    }
  } catch (error) {
    next(error);
  }
};
