const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Render पर सही domain use करने के लिए
const BASE_URL = process.env.BASE_URL || "https://interior-backend.onrender.com";

app.use(express.json());
app.use(cors());

// Serve frontend (optional, अगर सिर्फ backend है तो हटा सकते हो)
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API
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

app.listen(PORT, () => {
  console.log(`Server running 👉 ${BASE_URL}`);
});
