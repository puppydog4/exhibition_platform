"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import {
  createExhibition,
  getUserExhibitions,
} from "../../utils/supabaseCollections";
import { useAuth } from "@/context/authContext";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [collections, setCollections] = React.useState<any[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();

  const fetchCollections = async () => {
    if (!user) return;
    try {
      const data = await getUserExhibitions(user.id);
      setCollections(data);
    } catch (err) {
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!title.trim()) return;
    try {
      if (user) {
        console.log(user.id);
        await createExhibition(user.id, title, description);
      } else {
        setError("User is not authenticated.");
      }
      setTitle("");
      setDescription("");
      setLoading(true);
      await fetchCollections(); // Refresh collections
    } catch (err) {
      setError("Error creating collection.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<AddIcon />}
      ></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleCreateCollection();
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Create Collection</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Create Collection</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
