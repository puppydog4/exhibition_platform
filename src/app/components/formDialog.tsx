"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress } from "@mui/material";
import {
  createExhibition,
  getUserExhibitions,
} from "../../utils/supabaseCollections";
import { useAuth } from "@/context/authContext";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [_collections, setCollections] = React.useState<any[]>([]);
  const [_error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [hasFetched, setHasFetched] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchCollections = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getUserExhibitions(user.id);
        setCollections(data);
      } catch {
        setError("Failed to load collections.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };
    fetchCollections();
  }, [user]);

  const handleCreateCollection = async () => {
    if (!title.trim()) return;
    try {
      if (user) {
        await createExhibition(user.id, title, description);
        setTitle("");
        setDescription("");
        setLoading(true);
        await getUserExhibitions(user.id);
      } else {
        setError("User is not authenticated.");
      }
    } catch {
      setError("Error creating collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
      >
        New Collection
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleCreateCollection();
              setOpen(false);
            },
          },
        }}
      >
        <DialogTitle>Create Collection</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 4 }}>
            {loading && !hasFetched ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <>
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
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={loading}>
            Create Collection
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
