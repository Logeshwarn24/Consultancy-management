const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // ✅ Allow all origins for testing

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Contact Schema (Ensure 'phone' is a String)
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, required: true }, // ✅ Fixed data type (String instead of Number)
});
const Contact = mongoose.model("Contact", contactSchema);

// Nodemailer Setup (Use App Password instead of Gmail password)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // ✅ Ensure correct email credentials
        pass: process.env.EMAIL_PASS, // ✅ Use Gmail App Password, not personal password
    },
});

// Contact Form Route (Ensure correct route)
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message, phone } = req.body;
        if (!name || !email || !message || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = new Contact({ name, email, message, phone });
        await newContact.save();

        // Send email notification
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        });

        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Error sending message", error });
    }
});

// Serve Frontend Files (Ensure path is correct)
const frontendPath = path.join(__dirname, "../frontend/");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
