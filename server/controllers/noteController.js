const Note = require('../models/Note');
const { v4: uuidv4 } = require('uuid');

exports.getNotes = async (req, res) => {
    try {
        const userNote = await Note.findOne({ where: { username: req.user.username } });
        if (!userNote)
            return res.status(404).json({ message: "Notes not found!" });
        res.status(200).json(userNote.noteData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error while fetching notes!" });
    }
};

exports.addNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const userNote = await Note.findOne({ where: { username: req.user.username } });

        if (!userNote) {
            await Note.create({
                username: req.user.username,
                email: req.user.email,
                noteData: {
                    notes: [{
                        id: uuidv4(),
                        title,
                        content,
                        createdAt: new Date().toISOString()
                    }]
                }
            });
        } else {
            let noteData = userNote.noteData;

            if (!noteData.notes) {
                noteData = { notes: [] };
            }

            noteData.notes.push({
                id: uuidv4(),
                title,
                content,
                createdAt: new Date().toISOString()
            });

            await Note.update(
                { noteData },
                { where: { username: req.user.username } }
            );
        }

        res.status(201).json({ message: "Note added successfully" });
    } catch (error) {
        console.error("Add note error:", error);
        res.status(500).json({ message: "Server Error while adding note!" });
    }
};

exports.updateNote = async (req, res) => {
    try {
        console.log("Update note request body:", req.body);
        const { id, title, content } = req.body;

        if (!id || !title || !content) {
            return res.status(400).json({ message: "ID, title and content are required" });
        }

        const userNote = await Note.findOne({ where: { username: req.user.username } });
        if (!userNote) {
            return res.status(404).json({ message: "Notes not found!" });
        }

        if (!userNote.noteData || !userNote.noteData.notes) {
            return res.status(404).json({ message: "Notes data structure is invalid" });
        }

        const noteIndex = userNote.noteData.notes.findIndex(note => note.id === id);
        console.log(`Note with ID ${id} found at index: ${noteIndex}`);

        if (noteIndex === -1) {
            return res.status(404).json({ message: "Note not found!" });
        }

        userNote.noteData.notes[noteIndex] = {
            ...userNote.noteData.notes[noteIndex],
            title,
            content,
            updatedAt: new Date().toISOString()
        };

        userNote.changed('noteData', true);
        await userNote.save();
        res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        console.error("Update note error:", error);
        res.status(500).json({ message: "Server Error while updating note!" });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        console.log("Delete note request params:", req.params);
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Note ID is required" });
        }

        const userNote = await Note.findOne({ where: { username: req.user.username } });
        if (!userNote) {
            return res.status(404).json({ message: "Notes not found!" });
        }

        if (!userNote.noteData || !userNote.noteData.notes) {
            return res.status(404).json({ message: "Notes data structure is invalid" });
        }

        const initialCount = userNote.noteData.notes.length;

        userNote.noteData.notes = userNote.noteData.notes.filter(note => note.id !== id);

        const newCount = userNote.noteData.notes.length;

        if (initialCount === newCount) {
            return res.status(404).json({ message: "Note not found with ID: " + id });
        }

        // Değişiklikleri kaydet
        userNote.changed('noteData', true);
        await userNote.save();
        console.log("Note deleted successfully");
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({ message: "Server Error while deleting note!" });
    }
};