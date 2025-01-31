const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const Note = require("../models/Note");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = process.env.ENCRYPTION_SECRET; // Secret key for encryption

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied!" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token!" });
  }
};

// Create a new note (encrypted)
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;

    const userId = req.user.userId; // User ID from JWT

    // Encrypt title and content with AES-256
    const encryptedTitle = crypto.AES.encrypt(title, SECRET_KEY).toString();
    const encryptedContent = crypto.AES.encrypt(content, SECRET_KEY).toString();

    const newNote = new Note({
      userId,
      encryptedTitle,
      encryptedContent,
    });

    await newNote.save();
    res.status(201).json({ message: "Note saved!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all notes of a user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; // User ID from JWT
    const notes = await Note.find({ userId }); // Get all notes of the user from DB

    // Decrypt title and content of each note
    const decryptedNotes = notes.map((note) => ({
      id: note._id,
      title: crypto.AES.decrypt(note.encryptedTitle, SECRET_KEY).toString(crypto.enc.Utf8),
      content: crypto.AES.decrypt(note.encryptedContent, SECRET_KEY).toString(crypto.enc.Utf8),
      createdAt: note.createdAt,
    }));

    res.json(decryptedNotes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const { title, content } = req.body;

    const userId = req.user.userId; // User ID from JWT
    const note = await Note.findOne({ _id: req.params.id, userId }); // Check if the note belongs to the user
    if (!note) return res.status(403).json({ message: "You are not authorized to update this note!" });

    // Encrypt title and content with AES-256
    const encryptedTitle = crypto.AES.encrypt(title, SECRET_KEY).toString();
    const encryptedContent = crypto.AES.encrypt(content, SECRET_KEY).toString();

    note.encryptedTitle = encryptedTitle;
    note.encryptedContent = encryptedContent;
    await note.save();

    res.json({ message: "Note updated!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; // User ID from JWT
    const note = await Note.findOne({ _id: req.params.id, userId }); // Check if the note belongs to the user
    if (!note) return res.status(403).json({ message: "You are not authorized to delete this note!" });

    await Note.deleteOne({ _id: req.params.id });

    res.json({ message: "Note deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
