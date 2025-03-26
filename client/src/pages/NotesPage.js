import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, IconButton, Box, Card, CardContent, CardActions, Collapse, Grid2 } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getNotes as apiGetNotes, addNote as apiAddNote, deleteNote as apiDeleteNote, updateNote as apiUpdateNote } from "../components/Api";
import LogoutButton from "../components/LogoutButton";

const NotesPage = () => {
  const [notesList, setNotesList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();

  const fetchNotes = async () => {
    try {
      const notes = await apiGetNotes();
      console.log(notes);
      setNotesList(notes);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const addNote = async () => {
    try {
      if (!title || !content) {
        return;
      }

      const isNoteExisting = notesList.find((note) => note.title === title);
      if (isNoteExisting) {
        return;
      }

      await apiAddNote(title, content);
      fetchNotes();
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      console.log("Silme işlemi için not ID:", id);
      await apiDeleteNote(id);
      console.log("Silme başarılı, notları yeniliyorum");
      fetchNotes();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  // Güncelleme işlemi için debugging
  const updateNote = async () => {
    try {
      console.log("Güncelleme verisi:", { id: selectedNote?.id, title, content });

      if (!selectedNote || !title || !content) {
        console.warn("Eksik veri, güncelleme yapılmıyor");
        return;
      }

      await apiUpdateNote(selectedNote.id, title, content);
      console.log("Güncelleme başarılı, notları yeniliyorum");
      fetchNotes();
      setEditMode(false);
      setSelectedNote(null);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  const handleEditClick = (note) => {
    setEditMode(true);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <LogoutButton />
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

      <Grid2 container spacing={3}
        sx={{
          flexDirection: "center",
        }}>
        {notesList.map((note) => {
          const isExpanded = expandedNoteId === note.id;
          const shouldShowExpandButton = note.content.length > 25 || note.title.length > 17;
          return (
            <Grid2 sx={{ height: "auto" }} size={{ xs: 12, sm: 6, md: 4 }} key={note.id}>
              <Card sx={{ height: "auto", borderRadius: 3 }}
                raised
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap={!isExpanded} color="primary" sx={{ fontWeight: "bold", wordBreak: "break-word" }} >
                    {note.title}
                  </Typography>
                  <Collapse
                    in={isExpanded}
                    collapsedSize={20}
                    timeout={600}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      noWrap={!isExpanded}
                      sx={{
                        wordBreak: "break-word",
                      }}
                    >
                      {note.content}
                    </Typography>
                  </Collapse>
                </CardContent>

                <CardActions>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box>
                      <IconButton onClick={() => handleEditClick(note)}>
                        <Edit color="grey" sx={{
                          '&:hover': {
                            color: theme.palette.success[theme.palette.mode],
                          },
                        }} />
                      </IconButton>
                      <IconButton onClick={() => deleteNote(note.id)}>
                        <Delete color="grey" sx={{
                          '&:hover': {
                            color: theme.palette.error[theme.palette.mode],
                          },
                        }} />
                      </IconButton>
                    </Box>

                    {shouldShowExpandButton && (<IconButton onClick={() => handleNoteClick(note.id)}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>)}
                  </Box>
                </CardActions>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>
    </Container>
  );
};

export default NotesPage;