const express = require("express");
const { addNote, getNotes, updateNote, deleteNote } = require("../controllers/noteController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotes);
router.post('/', addNote);
router.put('/', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;