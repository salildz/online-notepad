import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Grid,
} from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  getNotes as apiGetNotes,
  addNote as apiAddNote,
  deleteNote as apiDeleteNote,
  updateNote as apiUpdateNote,
  setErrorHandler,
} from "../components/Api";
import LogoutButton from "../components/LogoutButton";
import { useTranslation } from "../../node_modules/react-i18next";
import { useError } from "../components/ErrorContext";
import SideMenu from "../components/SideMenu";
import AppNavbar from "../components/AppNavbar";

const NotesPage = () => {
  const { t } = useTranslation();
  const { showError } = useError();
  const [notesList, setNotesList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setErrorHandler(showError);
  }, [showError]);

  const fetchNotes = async () => {
    try {
      const notes = await apiGetNotes();
      setNotesList(notes);
    } catch (err) {
      showError("notes.fetchFailed");
    }
  };

  const addNote = async () => {
    try {
      if (!title || !content) {
        showError("notes.invalidData");
        return;
      }

      const isNoteExisting = notesList.find((note) => note.title === title);
      if (isNoteExisting) {
        showError("notes.titleExists");
        return;
      }

      await apiAddNote(title, content);
      fetchNotes();
      setTitle("");
      setContent("");
    } catch (err) {
      showError("notes.addFailed");
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiDeleteNote(id);
      fetchNotes();
    } catch (err) {
      showError("notes.deleteFailed");
    }
  };

  const updateNote = async () => {
    try {
      console.log("Güncelleme verisi:", { id: selectedNote?.id, title, content });

      if (!selectedNote || !title || !content) {
        showError("notes.invalidData");
        return;
      }

      await apiUpdateNote(selectedNote.id, title, content);
      fetchNotes();
      setEditMode(false);
      setSelectedNote(null);
      setTitle("");
      setContent("");
    } catch (err) {
      showError("notes.updateFailed");
    }
  };

  const handleEditClick = (note) => {
    setEditMode(true);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditMode(false);
    setTitle("");
    setContent("");
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
      <SideMenu />
      <AppNavbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold" }}
        >
          {t("notes.title")}
        </Typography>
        <LogoutButton />
      </Box>

      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label={t("common.title")}
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label={t("common.content")}
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          variant="contained"
          color={editMode ? "success" : "primary"}
          fullWidth
          size="large"
          onClick={editMode ? updateNote : addNote}
        >
          {editMode ? t("notes.saveNote") : t("notes.saveNote")}
        </Button>
        {editMode && (
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            onClick={handleCancel}
          >
            {t("common.cancel")}
          </Button>
        )}
      </Box>
      {notesList.length === 0 && (
        <Typography
          align="center"
          color="textSecondary"
          sx={{ mt: 4 }}
        >
          {t("notes.noNotes")}
        </Typography>
      )}
      <Grid
        container
        spacing={3}
        sx={{
          flexDirection: "center",
        }}
      >
        {notesList.map((note) => {
          const isExpanded = expandedNoteId === note.id;
          const shouldShowExpandButton = note.content.length > 25 || note.title.length > 17;
          return (
            <Grid
              sx={{ height: "auto" }}
              size={{ xs: 12, sm: 6, md: 4 }}
              key={note.id}
            >
              <Card
                sx={{ height: "auto", borderRadius: 3 }}
                raised
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    noWrap={!isExpanded}
                    color="primary"
                    sx={{ fontWeight: "bold", wordBreak: "break-word" }}
                  >
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
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Box>
                      <IconButton onClick={() => handleEditClick(note)}>
                        <Edit
                          color="grey"
                          sx={{
                            "&:hover": {
                              color: theme.palette.success[theme.palette.mode],
                            },
                          }}
                        />
                      </IconButton>
                      <IconButton onClick={() => deleteNote(note.id)}>
                        <Delete
                          color="grey"
                          sx={{
                            "&:hover": {
                              color: theme.palette.error[theme.palette.mode],
                            },
                          }}
                        />
                      </IconButton>
                    </Box>

                    {shouldShowExpandButton && (
                      <IconButton onClick={() => handleNoteClick(note.id)}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </Box>
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
