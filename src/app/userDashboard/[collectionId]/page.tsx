"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  ExhibitionArtwork,
  getExhibitionArtworks,
  removeArtworkFromExhibition,
} from "../../../utils/supabaseCollections"; // Adjust the import path as needed

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewCollectionPage />
    </QueryClientProvider>
  );
}

function ViewCollectionPage() {
  const { collectionId } = useParams<{ collectionId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: artworks = [],
    isLoading,
    error,
  } = useQuery<ExhibitionArtwork[]>({
    queryKey: ["collectionArtworks", collectionId],
    queryFn: async () => {
      if (!collectionId) throw new Error("Invalid collection ID.");
      return getExhibitionArtworks(collectionId);
    },
    enabled: Boolean(collectionId),
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const totalArtworks = artworks.length;
  const currentArtwork = artworks[currentIndex] ?? null;

  // Prefetch adjacent artworks
  useEffect(() => {
    if (!artworks.length) return;

    [1, 2, 3].forEach((offset) => {
      const nextIndex = currentIndex + offset;
      const prevIndex = currentIndex - offset;

      if (nextIndex < totalArtworks) {
        queryClient.prefetchQuery({
          queryKey: ["collectionArtworks", collectionId, nextIndex],
          queryFn: () => Promise.resolve(artworks[nextIndex]),
        });
      }

      if (prevIndex >= 0) {
        queryClient.prefetchQuery({
          queryKey: ["collectionArtworks", collectionId, prevIndex],
          queryFn: () => Promise.resolve(artworks[prevIndex]),
        });
      }
    });
  }, [currentIndex, artworks, collectionId, queryClient, totalArtworks]);

  // Handle navigation
  const goToNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, totalArtworks - 1));
  const goToPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  // Remove Artwork Mutation
  const removeArtworkMutation = useMutation({
    mutationFn: (artworkId: string) =>
      removeArtworkFromExhibition(artworkId, collectionId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collectionArtworks", collectionId],
      });
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0)); // Adjust index if needed
    },
  });

  const handleRemoveArtwork = () => {
    if (currentArtwork) {
      removeArtworkMutation.mutate(currentArtwork.artwork_id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={50} />
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
    <Container maxWidth="md" sx={{ pt: 4, pb: 6, textAlign: "center" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Collection Artworks
      </Typography>

      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => router.push("/userDashboard")}
      >
        Return to Collections
      </Button>

      <Typography variant="body1" sx={{ mb: 3 }}>
        <strong>Total Artworks:</strong> {totalArtworks}
      </Typography>

      {currentArtwork ? (
        <Card
          sx={{
            maxWidth: "100%",
            mx: "auto",
            boxShadow: 4,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            height="400"
            image={currentArtwork.image_url || "/placeholder-image.png"}
            alt={currentArtwork.title}
            onClick={() => setDialogOpen(true)}
            sx={{ cursor: "pointer", objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="h6" fontWeight={600}>
              {currentArtwork.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentArtwork.artist || "Unknown Artist"}
            </Typography>
          </CardContent>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleRemoveArtwork}
              disabled={removeArtworkMutation.isPending}
            >
              {removeArtworkMutation.isPending
                ? "Removing..."
                : "Remove from Collection"}
            </Button>
          </Box>
        </Card>
      ) : (
        <Typography sx={{ mt: 3 }}>No artworks in this collection.</Typography>
      )}

      {/* Navigation */}
      {totalArtworks > 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 3 }}>
          <Button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            variant="outlined"
          >
            Previous
          </Button>
          <Button
            onClick={goToNext}
            disabled={currentIndex >= totalArtworks - 1}
            variant="contained"
          >
            Next
          </Button>
        </Box>
      )}

      {/* Full-Screen Image Modal */}
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
    </Container>
  );
}
