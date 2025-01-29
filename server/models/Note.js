const mongoose = require("mongoose");
const crypto = require("crypto-js");

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  encryptedContent: { type: String, required: true }, // Şifrelenmiş not içeriği
  createdAt: { type: Date, default: Date.now },
});

// Not modelini dışa aktar
module.exports = mongoose.model("Note", NoteSchema);
