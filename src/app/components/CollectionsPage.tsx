"use client";

import { useState, useEffect, useContext } from "react";
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

  const deleteCollection = async (id: string) => {
    try {
      if (!user) return;
      deleteUserExhibition(id);
      const data = await getUserExhibitions(user.id);
      setCollections(data);
    } catch (err) {
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [user, collections]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Your Collections
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {/* Create New Collection Form */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && collections.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {collections.map((collection, index) => (
            <Card key={index}>
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h5" component="div">
                  {collection.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {collection.description}
                </Typography>
                <Button>View</Button>
                <Button
                  onClick={() => {
                    deleteCollection(collection.id);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
          <FormDialog />
        </Box>
      ) : (
        !loading && (
          <>
            <Typography>No collections found.</Typography> <FormDialog />
          </>
        )
      )}
    </Box>
  );
};

export default CollectionsPage;
