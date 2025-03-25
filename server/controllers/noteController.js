const Note = require('../models/note');

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

exports.updateNotes = async (req, res) => {
    try {
        console.log(req.body, req.user);
        const userNote = await Note.findOne({ where: { username: req.user.username } });
        if (!userNote)
            return res.status(404).json({ message: "Notes not found!" });
        userNote.noteData = req.body;
        await userNote.save();
        res.status(200).json({ message: "Notes updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error while updating notes!" });
    }
};