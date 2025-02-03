import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, IconButton, Box, Card, CardContent, CardActions } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { notes } from "./api"; // api.js'den notes'u import et
import LogoutButton from "../components/LogoutButton";

const NotesPage = ({ user, setUser }) => {
  const [notesList, setNotesList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();

  const fetchNotes = async () => {
    try {
      const res = await notes.fetchNotes(); // api.js'deki fetchNotes fonksiyonunu kullan
      setNotesList(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addNote = async () => {
    try {
      await notes.addNote(title, content); // api.js'deki addNote fonksiyonunu kullan
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await notes.deleteNote(id); // api.js'deki deleteNote fonksiyonunu kullan
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const updateNote = async () => {
    try {
      await notes.updateNote(selectedNote.id, title, content); // api.js'deki updateNote fonksiyonunu kullan
      fetchNotes();
      setEditMode(false);
      setSelectedNote(null);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const handleEditClick = (note) => {
    setEditMode(true);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(note);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTitle('');
    setContent('');
    setSelectedNote(null);
  };

  const handleNoteClick = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>Notes</Typography>
        <LogoutButton setUser={setUser} />
      </Box>

      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Content" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
        <Button variant="contained" color={editMode ? "success" : "primary"} fullWidth size="large" onClick={editMode ? updateNote : addNote}>
          {editMode ? "Save Note" : "Add Note"}
        </Button>
        {editMode && (
          <Button variant="contained" color="error" fullWidth size="large" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {notesList.map((note) => {
          const isExpanded = expandedNoteId === note.id;
          return (
            <Card key={note.id} sx={{ width: 300 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {note.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {note.content}
                </Typography>
              </CardContent>

              <CardActions>
                <Box>
                  <IconButton onClick={() => handleEditClick(note)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => deleteNote(note.id)}>
                    <Delete color="error" />
                  </IconButton>
                </Box>
                <IconButton onClick={() => handleNoteClick(note.id)}>
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default NotesPage;