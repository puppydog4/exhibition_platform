"use client";

import { useState } from "react";
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
} from "../../../utils/supabaseCollections";

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

  if (!collectionId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Invalid Collection ID.
        </Typography>
      </Box>
    );
  }

  const {
    data: artworks = [],
    isLoading,
    error,
  } = useQuery<ExhibitionArtwork[]>({
    queryKey: ["collectionArtworks", collectionId],
    queryFn: () => getExhibitionArtworks(collectionId),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalArtworks = artworks.length;
  const currentArtwork = artworks[currentIndex] || null;

  // Remove Artwork Mutation with Optimistic Update
  const removeArtworkMutation = useMutation({
    mutationFn: async (artworkId: string) => {
      await removeArtworkFromExhibition(artworkId, collectionId);
    },
    onMutate: async (artworkId) => {
      await queryClient.cancelQueries({
        queryKey: ["collectionArtworks", collectionId],
      });
      const previousArtworks = queryClient.getQueryData<ExhibitionArtwork[]>([
        "collectionArtworks",
        collectionId,
      ]);

      queryClient.setQueryData(
        ["collectionArtworks", collectionId],
        (old: ExhibitionArtwork[] | undefined) =>
          old ? old.filter((artwork) => artwork.artwork_id !== artworkId) : []
      );

      return { previousArtworks };
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(
        ["collectionArtworks", collectionId],
        context?.previousArtworks
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["collectionArtworks", collectionId],
      });
    },
  });

  const handleRemoveArtwork = () => {
    if (currentArtwork) {
      removeArtworkMutation.mutate(currentArtwork.artwork_id);
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
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

      {totalArtworks > 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 3 }}>
          <Button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            variant="outlined"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={currentIndex >= totalArtworks - 1}
            variant="contained"
          >
            Next
          </Button>
        </Box>
      )}

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
        </DialogContent>
      </Dialog>
    </Container>
  );
}
