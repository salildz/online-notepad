const express = require("express");
const { getNotes, updateNotes } = require("../controllers/noteController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getNotes);
router.put("/", authenticateToken, updateNotes);

module.exports = router;