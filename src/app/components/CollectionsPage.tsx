"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  deleteUserExhibition,
  getUserExhibitions,
} from "../../utils/supabaseCollections";
import FormDialog from "./formDialog";

const CollectionsPage = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchCollections = async (retryCount = 3) => {
      setLoading(true);
      setError("");

      try {
        const data = await getUserExhibitions(user.id);
        setCollections(data);
      } catch (_) {
        if (retryCount > 0) {
          setTimeout(() => fetchCollections(retryCount - 1), 2000); // Retry with delay
        } else {
          setError("Failed to load collections. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user]);

  const deleteCollection = async (id: string) => {
    if (!user) return;
    setIsDeleting(id);

    try {
      await deleteUserExhibition(id);
      setCollections((prev) =>
        prev.filter((collection) => collection.id !== id)
      );
    } catch {
      setError("Failed to delete collection.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, margin: "auto", textAlign: "center" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Your Collections
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress size={60} />
        </Box>
      ) : collections.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 3,
            mt: 3,
          }}
        >
          {collections.map((collection) => (
            <Card key={collection.id} sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {collection.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {collection.description}
                </Typography>
                <Button
                  href={`userDashboard/${collection.id}`}
                  variant="contained"
                  sx={{ mr: 1 }}
                  aria-label={`View collection: ${collection.title}`}
                >
                  View
                </Button>
                <Button
                  onClick={() => deleteCollection(collection.id)}
                  variant="outlined"
                  color="error"
                  disabled={isDeleting === collection.id}
                  aria-label={`Delete collection: ${collection.title}`}
                >
                  {isDeleting === collection.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography sx={{ mt: 3, color: "text.secondary" }}>
          No collections found.
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <FormDialog />
      </Box>
    </Box>
  );
};

export default CollectionsPage;
