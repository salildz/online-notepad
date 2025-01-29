const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Kullanıcı Kaydı (Register)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı mevcut mu kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı!" });
    }

    // Yeni kullanıcı oluştur
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Kayıt başarılı!" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Kullanıcı Girişi (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcı var mı kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });
    }

    // JWT oluştur
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
