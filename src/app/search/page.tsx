"use client";

import { MetPagination } from "../components/metPagination";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import fetchSearchResults from "@/utils/fetchSearchResultsMet";
import { useEffect, useMemo, useState } from "react";
import fetchArtworkDetail from "@/utils/fetchArtworkDetailsMet";

const queryClient = new QueryClient();

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <SearchResultsPage />
    </QueryClientProvider>
  );
}

function SearchResultsPage() {
  // Extract search parameters from the URL
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query") || "";
  const departmentId = searchParams.get("department") || "";

  const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${encodeURIComponent(
    departmentId
  )}&q=${encodeURIComponent(searchTerm)}`;

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: [searchUrl],
    queryFn: () => fetchSearchResults(searchUrl),
    enabled: Boolean(searchTerm && departmentId),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const objectIDs: number[] = useMemo(
    () => searchData?.objectIDs || [],
    [searchData]
  );
  const currentObjectID = objectIDs.length ? objectIDs[currentIndex] : null;

  const queryClient = useQueryClient();

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

  // Prefetch the 3 previous and next artwork details whenever currentIndex changes
  useEffect(() => {
    if (objectIDs.length > 0) {
      for (let i = 1; i <= 3; i++) {
        if (currentIndex + i < objectIDs.length) {
          const nextId = objectIDs[currentIndex + i];
          queryClient.prefetchQuery({
            queryKey: ["artwork", nextId],
            queryFn: () => fetchArtworkDetail(nextId),
          });
        }
      }
      for (let i = 1; i <= 3; i++) {
        if (currentIndex - i >= 0) {
          const prevId = objectIDs[currentIndex - i];
          queryClient.prefetchQuery({
            queryKey: ["artwork", prevId],
            queryFn: () => fetchArtworkDetail(prevId),
          });
        }
      }
    }
  }, [currentIndex, objectIDs, queryClient]);

  // --- Loading and Error States for Search ---
  if (searchLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (searchError) {
    return (
      <Typography variant="h6" color="error" sx={{ p: 2 }}>
        {(searchError as Error).message}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Button href="/METcollections">Return to Search</Button>
      <Typography variant="body1" gutterBottom>
        Total Artworks Found: {searchData.total}
      </Typography>

      <Box sx={{ my: 3 }}>
        {artworkLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : artworkError ? (
          <Typography variant="body1" color="error">
            Error loading artwork details: {(artworkError as Error).message}
          </Typography>
        ) : artworkData ? (
          <Card sx={{ maxWidth: 600, margin: "auto" }}>
            <CardMedia
              component="img"
              height="400"
              image={artworkData.primaryImage || "/placeholder-image.png"}
              alt={artworkData.title}
              onClick={() => setOpen(true)}
            />
            <CardContent>
              <Typography variant="h6">{artworkData.title}</Typography>
              <Typography variant="body2">
                {artworkData.artistDisplayName}
              </Typography>
              <Typography variant="body2">{artworkData.objectDate}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography>No artwork data available.</Typography>
        )}
      </Box>

      <Dialog
        open={open}
        fullScreen
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "black", // Set background to black for full-screen effect
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <DialogContent className="relative p-0">
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
          {/* Full Image */}
          <img
            src={artworkData?.primaryImage || "/placeholder-image.png"}
            alt="Expanded View"
            className="w-full h-auto"
            style={{
              maxWidth: "100%",
              maxHeight: "100vh",
              objectFit: "contain", // Ensures full image fits while maintaining aspect ratio
            }}
          />
        </DialogContent>
        <MetPagination
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          objectIDs={objectIDs}
        />
      </Dialog>

      {/* Pagination Controls */}
      <MetPagination
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        objectIDs={objectIDs}
      />
    </Box>
  );
}
