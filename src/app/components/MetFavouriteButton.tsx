"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/authContext";
import {
  getUserExhibitions,
  addArtworkToExhibition,
} from "../../utils/supabaseCollections"; // Your function to fetch exhibitions

interface FavoriteButtonProps {
  artwork: any;
  collection: any;
}

export default function MetFavoriteButton({
  artwork,
  collection,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [inserting, setInserting] = useState(false);

  // When the button is clicked, open the dialog and fetch user's collections
  const handleClickOpen = async () => {
    setOpen(true);
    if (user) {
      setLoadingCollections(true);
      try {
        const data = await getUserExhibitions(user.id);
        setCollections(data);
      } catch (err) {
        console.error("Error fetching collections", err);
      } finally {
        setLoadingCollections(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection) return;
    setInserting(true);
    try {
      await addArtworkToExhibition(selectedCollection, {
        artwork_id: artwork.objectID,
        title: artwork.title,
        artist: artwork.artistDisplayName,
        image_url: artwork.primaryImage || "",
        museum: "MET",
        api_url:
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artwork.objectID}` ||
          "",
      });
      setOpen(false);
    } catch (err) {
      console.error("Error adding artwork", err);
    } finally {
      setInserting(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add to Collection
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Artwork to a Collection</DialogTitle>
        <DialogContent>
          {loadingCollections ? (
            <CircularProgress />
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="collection-select-label">Collection</InputLabel>
              <Select
                labelId="collection-select-label"
                value={selectedCollection}
                label="Collection"
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                {collections.map((collection) => (
                  <MenuItem key={collection.id} value={collection.id}>
                    {collection.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAddToCollection}
            disabled={!selectedCollection || inserting}
          >
            {inserting ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
