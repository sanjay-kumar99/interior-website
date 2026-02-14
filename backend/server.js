const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

const BASE_URL =
  process.env.BASE_URL || "https://interior-website-bwn1.onrender.com";
  

// ✅ Proper CORS config
app.use(
  cors({
    origin: [
      "https://interior-showcase.netlify.app", // Netlify domain allow
      "http://localhost:3000", // local dev allow
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

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
