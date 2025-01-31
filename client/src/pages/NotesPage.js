import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, IconButton, Box, Card, CardContent, CardActions, Grid } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const NotesPage = ({ user, setUser }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${user}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addNote = async () => {
    try {
      await axios.post("http://localhost:5000/api/notes/add", { title, content }, {
        headers: { Authorization: `Bearer ${user}` },
      });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${user}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const updateNote = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notes/${selectedNote.id}`, { title, content }, {
        headers: { Authorization: `Bearer ${user}` },
      });
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
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>Notes</Typography>
        <LogoutButton setUser={setUser} />
      </Box>

      {/* Not Ekleme Alanı */}
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

      {/* Not Kartları */}
      <Grid container spacing={3}>
        {notes.map((note) => {
          const isExpanded = expandedNoteId === note.id;
          return (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: "all 0.3s",
                  ":hover": { boxShadow: 6 },
                  backgroundColor: theme.palette.background.paper,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: isExpanded ? "auto" : "250px",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ padding: 3, cursor: "pointer" }} onClick={() => handleNoteClick(note.id)}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: isExpanded ? "block" : "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: isExpanded ? "unset" : "3",
                      transition: "all 0.3s",
                    }}
                  >
                    {note.content}
                  </Typography>
                </CardContent>

                <CardActions sx={{ display: "flex", justifyContent: "space-between", paddingX: 2 }}>
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
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default NotesPage;
