"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getExhibitionArtworks } from "../../../utils/supabaseCollections"; // Adjust the import path as needed

// Define the ExhibitionArtwork type
type ExhibitionArtwork = {
  id: string;
  exhibition_id: string;
  artwork_id: string;
  title: string;
  artist: string;
  image_url: string;
  museum: string;
  api_url: string;
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewCollectionPage />
    </QueryClientProvider>
  );
}

function ViewCollectionPage() {
  // Get collection id from route parameters
  const { collectionId } = useParams<{ collectionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch artworks from Supabase for this collection
  const {
    data: artworks,
    isLoading,
    error,
  } = useQuery<ExhibitionArtwork[]>({
    queryKey: ["collectionArtworks", collectionId],
    queryFn: () => getExhibitionArtworks(collectionId!),
    enabled: !!collectionId,
  });

  const totalArtworks = artworks?.length || 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentArtwork =
    artworks && artworks.length ? artworks[currentIndex] : null;

  // Prefetch a few adjacent artworks
  useEffect(() => {
    if (artworks && artworks.length > 0) {
      for (let i = 1; i <= 3; i++) {
        if (currentIndex + i < artworks.length) {
          queryClient.prefetchQuery({
            queryKey: ["collectionArtworks", collectionId, currentIndex + i],
            queryFn: () => Promise.resolve(artworks[currentIndex + i]),
          });
        }
        if (currentIndex - i >= 0) {
          queryClient.prefetchQuery({
            queryKey: ["collectionArtworks", collectionId, currentIndex - i],
            queryFn: () => Promise.resolve(artworks[currentIndex - i]),
          });
        }
      }
    }
  }, [currentIndex, artworks, collectionId, queryClient]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Collection Artworks
      </Typography>
      <Button variant="outlined" onClick={() => router.push("/userDashboard")}>
        Return to Collections
      </Button>
      <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
        Total Artworks Found: {totalArtworks}
      </Typography>

      {currentArtwork ? (
        <Card sx={{ maxWidth: 600, margin: "auto", my: 3 }}>
          <CardMedia
            component="img"
            height="400"
            image={currentArtwork.image_url || "/placeholder-image.png"}
            alt={currentArtwork.title}
            onClick={() => setDialogOpen(true)}
            sx={{ cursor: "pointer" }}
          />
          <CardContent>
            <Typography variant="h6">{currentArtwork.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentArtwork.artist}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography>No artworks in this collection.</Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Button
          onClick={() =>
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setCurrentIndex((prev) =>
              prev < totalArtworks - 1 ? prev + 1 : prev
            )
          }
          disabled={currentIndex >= totalArtworks - 1}
        >
          Next
        </Button>
      </Box>

      {/* Full-Screen Dialog for Image */}
      <Dialog
        open={dialogOpen}
        fullScreen
        onClose={() => setDialogOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <DialogContent sx={{ position: "relative", p: 0, color: "white" }}>
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.8)",
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={currentArtwork?.image_url || "/placeholder-image.png"}
            alt={currentArtwork?.title}
            sx={{
              maxWidth: "100%",
              maxHeight: "100vh",
              objectFit: "contain",
              display: "block",
              margin: "auto",
            }}
          />
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">{currentArtwork?.title}</Typography>
            <Typography variant="body2">{currentArtwork?.artist}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
