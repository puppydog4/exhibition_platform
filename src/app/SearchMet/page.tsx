"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import fetchSearchResults from "@/utils/fetchSearchResultsMet";
import fetchArtworkDetail from "@/utils/fetchArtworkDetailsMet";
import { MetPagination } from "../components/metPagination";
import MetFavoriteButton from "../components/MetFavouriteButton";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchResultsPage />
    </QueryClientProvider>
  );
}

function SearchResultsPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query") || "";
  const departmentId = searchParams.get("department") || "";
  const dateBegin = parseInt(searchParams.get("dateBegin") || "-5000");
  const dateEnd = parseInt(searchParams.get("dateEnd") || "2024");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const searchUrl = useMemo(
    () =>
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&departmentId=${encodeURIComponent(
        departmentId
      )}&q=${encodeURIComponent(
        searchTerm
      )}&dateBegin=${dateBegin}&dateEnd=${dateEnd}`,
    [departmentId, searchTerm, dateBegin, dateEnd]
  );

  // Fetch Search Results
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["searchResults", departmentId, searchTerm, dateBegin, dateEnd],
    queryFn: () => fetchSearchResults(searchUrl),
    enabled: Boolean(searchTerm && departmentId),
  });

  const objectIDs = useMemo(() => searchData?.objectIDs || [], [searchData]);
  const currentObjectID = objectIDs.length ? objectIDs[currentIndex] : null;

  // Fetch Artwork Details
  const {
    data: artworkData,
    isLoading: artworkLoading,
    error: artworkError,
  } = useQuery({
    queryKey: ["artwork", currentObjectID],
    queryFn: () => fetchArtworkDetail(currentObjectID as number),
    enabled: Boolean(currentObjectID),
    staleTime: 1000 * 60 * 5,
  });

  // Prefetch Nearby Artworks for Smooth Navigation
  useEffect(() => {
    if (objectIDs.length > 0) {
      for (let i = -3; i <= 3; i++) {
        if (i !== 0) {
          const id = objectIDs[currentIndex + i];
          if (id) {
            queryClient.prefetchQuery({
              queryKey: ["artwork", id],
              queryFn: () => fetchArtworkDetail(id),
            });
          }
        }
      }
    }
  }, [currentIndex, objectIDs, queryClient]);

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6, textAlign: "center" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Search Results
      </Typography>

      <Button href="/METcollections" variant="outlined" sx={{ mb: 2 }}>
        Return to Search
      </Button>

      {searchLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : searchError ? (
        <Typography variant="h6" color="error" sx={{ mt: 3 }}>
          {(searchError as Error).message}
        </Typography>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 3 }}>
            <strong>Total Artworks Found:</strong> {searchData.total}
          </Typography>

          {/* Artwork Details */}
          {artworkLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress size={50} />
            </Box>
          ) : artworkError ? (
            <Typography variant="body1" color="error">
              Error loading artwork details: {(artworkError as Error).message}
            </Typography>
          ) : artworkData ? (
            <Card
              sx={{
                maxWidth: "100%",
                mx: "auto",
                boxShadow: 4,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {artworkData.primaryImage ? (
                <CardMedia
                  component="img"
                  height="400"
                  image={artworkData.primaryImage}
                  alt={artworkData.title}
                  onClick={() => setOpen(true)}
                  sx={{ cursor: "pointer", objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Image not available
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {artworkData.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {artworkData.artistDisplayName}
                </Typography>
                <Typography variant="body2">
                  {artworkData.objectDate}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography sx={{ mt: 3 }}>No artwork data available.</Typography>
          )}

          {/* Full-Screen Image Modal */}
          <Dialog
            open={open}
            fullScreen
            sx={{
              "& .MuiDialog-paper": {
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          >
            <DialogContent sx={{ color: "white", textAlign: "center" }}>
              <IconButton
                onClick={() => setOpen(false)}
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
              <img
                src={artworkData?.primaryImage}
                alt="Expanded View"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100vh",
                  objectFit: "contain",
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Pagination & Favorite Button */}
          <MetPagination
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            objectIDs={objectIDs}
          />
          <MetFavoriteButton artwork={artworkData} collection={departmentId} />
        </>
      )}
    </Container>
  );
}
