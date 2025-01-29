const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const Note = require("../models/Note");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = process.env.ENCRYPTION_SECRET; // Şifreleme için gizli anahtar

// Middleware: Kullanıcıyı JWT ile doğrula
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Erişim reddedildi!" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Geçersiz token!" });
  }
};

// 🔐 Not Oluştur (Şifreli Kaydet)
router.post("/add", authenticateUser, async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.userId; // JWT'den gelen kullanıcı ID
  
      // Başlık ve içeriği AES-256 ile şifrele
      const encryptedTitle = crypto.AES.encrypt(title, SECRET_KEY).toString();
      const encryptedContent = crypto.AES.encrypt(content, SECRET_KEY).toString();
  
      const newNote = new Note({
        userId,
        title: encryptedTitle, // Şifrelenmiş başlık
        encryptedContent,      // Şifrelenmiş içerik
      });
  
      await newNote.save();
      res.status(201).json({ message: "Not kaydedildi!" });
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });
  
  

// 🔓 Kullanıcının Sadece Kendi Notlarını Getir
router.get("/", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const notes = await Note.find({ userId });
  
      // Notların başlık ve içeriğini çözüyoruz
      const decryptedNotes = notes.map((note) => ({
        id: note._id,
        title: crypto.AES.decrypt(note.title, SECRET_KEY).toString(crypto.enc.Utf8), // Başlık şifre çözme
        content: crypto.AES.decrypt(note.encryptedContent, SECRET_KEY).toString(crypto.enc.Utf8), // İçerik şifre çözme
        createdAt: note.createdAt,
      }));
  
      res.json(decryptedNotes);
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });  

// ✏️ Not Güncelle
router.put("/:id", authenticateUser, async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.userId;
  
      const note = await Note.findOne({ _id: req.params.id, userId });
      if (!note) return res.status(403).json({ message: "Bu notu düzenleme yetkiniz yok!" });
  
      // Başlığı ve içeriği tekrar şifrele
      const encryptedTitle = crypto.AES.encrypt(title, SECRET_KEY).toString();
      const encryptedContent = crypto.AES.encrypt(content, SECRET_KEY).toString();
  
      note.title = encryptedTitle;
      note.encryptedContent = encryptedContent;
      await note.save();
  
      res.json({ message: "Not güncellendi!" });
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });  
  

// ❌ Not Sil
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Kullanıcının sahip olduğu not mu?
      const note = await Note.findOne({ _id: req.params.id, userId });
      if (!note) return res.status(403).json({ message: "Bu notu silme yetkiniz yok!" });
  
      await Note.deleteOne({ _id: req.params.id });
  
      res.json({ message: "Not silindi!" });
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });
  

module.exports = router;
