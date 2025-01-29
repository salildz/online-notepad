require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(express.json());
app.use(cors());

app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Bağlantısı Başarılı"))
  .catch((err) => console.error("❌ MongoDB Bağlantı Hatası:", err));

// Test Endpoint
app.get("/", (req, res) => {
  res.send("🔒 Secure Notes API Çalışıyor!");
});

// Sunucuyu Başlat
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor...`));
