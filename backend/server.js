const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 5000;

const BASE_URL =
  process.env.BASE_URL || "https://interior-website-bwn1.onrender.com";

// ✅ Proper CORS config
app.use(
  cors({
    origin: [
      "https://interior-showcase-olive.vercel.app/", // vercel domain allow
      "http://localhost:3000", // local dev allow
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ For form submissions

// ✅ CONTACT FORM ROUTE
app.post("/api/contact", async (req, res) => {
  const { name, phone, email, message } = req.body;

  try {
    // Configure transporter (use Gmail or your SMTP)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password (not your real password!)
      },
    });

    // Email content
    let mailOptions = {
      from: email,
      to: "saiinterior@gmail.com", // your business email
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message." });
  }
});

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API route
app.get("/api/gallery/:category", (req, res) => {
  const cat = req.params.category;
  const dirPath = path.join(__dirname, "uploads/images/services", cat);

  if (!fs.existsSync(dirPath)) {
    return res.status(404).json({ error: "Invalid category" });
  }

  const files = fs.readdirSync(dirPath);

  const urls = files.map(
    (file) => `${BASE_URL}/uploads/images/services/${cat}/${file}`,
  );

  res.json(urls);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running 👉 ${BASE_URL}`);
});
