// pages/PageTemplate.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Pagination } from "../components/pagination";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import fetchRijiksArtWorks from "@/utils/fetchRIjksArtworks";

const queryClient = new QueryClient();

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <SearchResultsPage />
    </QueryClientProvider>
  );
}

const SearchResultsPage: React.FC = () => {
  // State to track the current item index.
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const query = useSearchParams().get("query") || "";

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      `https://www.rijksmuseum.nl/api/en/collection?key=`,
      `&q=${encodeURIComponent(query)}`,
      `&ps=100&imgonly=True&s=relevance`,
    ],
    queryFn: fetchRijiksArtWorks,
  });

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ p: 2 }}>
        {(error as Error).message}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Display the current item */}
      <Card sx={{ maxWidth: 600, margin: "auto" }}>
        <CardMedia
          component="img"
          image={data[currentIndex].headerImage.url}
          onClick={() => setOpen(true)}
        />
        <CardContent>
          <Typography variant="body1">
            {data[currentIndex].longTitle}
          </Typography>
        </CardContent>
      </Card>
      {/* Render Pagination Controls */}
      <Pagination
        totalItems={data.length}
        currentIndex={currentIndex}
        onPageChange={setCurrentIndex}
      />
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
            src={data[currentIndex].webImage.url}
            alt="Expanded View"
            className="w-full h-auto"
            style={{
              maxWidth: "100%",
              maxHeight: "100vh",
              objectFit: "contain", // Ensures full image fits while maintaining aspect ratio
            }}
          />
        </DialogContent>
        <Pagination
          totalItems={data.length}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
        />
      </Dialog>
    </Box>
  );
};
