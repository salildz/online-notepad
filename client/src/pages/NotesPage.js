import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const NotesPage = ({ user, setUser }) => {  // setUser'ı buraya ekledik!
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${user}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Notları alırken hata:", err);
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
      console.error("Not eklerken hata:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${user}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Not silerken hata:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
        <Typography variant="h4">Notlar</Typography>
        <LogoutButton setUser={setUser} />
      </Box>
      <TextField label="Başlık" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="İçerik" fullWidth margin="normal" multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={addNote}>Not Ekle</Button>
      <List>
        {notes.map((note) => (
          <ListItem key={note.id} secondaryAction={
            <IconButton edge="end" onClick={() => deleteNote(note.id)}>
              <Delete />
            </IconButton>
          }>
            <ListItemText primary={note.title} secondary={note.content} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default NotesPage;
