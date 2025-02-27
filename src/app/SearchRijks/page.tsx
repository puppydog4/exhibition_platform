"use client";

import React, { useState } from "react";
import {
  Box,
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
import FavoriteButton from "../components/RijksFavouriteButton";
import RijksFavoriteButton from "../components/RijksFavouriteButton";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchResultsPage />
    </QueryClientProvider>
  );
}

const SearchResultsPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const century = searchParams.get("century") || "";
  const sort = searchParams.get("sort") || "relevance";

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      `https://www.rijksmuseum.nl/api/en/collection?key=`,
      `&q=${encodeURIComponent(query)}`,
      `&ps=100&imgonly=true`,
      `&s=${sort}`,
      `&century=${century}`,
    ],
    queryFn: fetchRijiksArtWorks,
  });

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" sx={{ p: 4, textAlign: "center" }}>
        {(error as Error).message}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          borderRadius: 4,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={data[currentIndex].headerImage.url}
          sx={{
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { opacity: 0.8 },
          }}
          onClick={() => setOpen(true)}
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            {data[currentIndex].longTitle}
          </Typography>
        </CardContent>
      </Card>
      <Pagination
        totalItems={data.length}
        currentIndex={currentIndex}
        onPageChange={setCurrentIndex}
      />
      <FavoriteButton artwork={data[currentIndex]} />
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
        <DialogContent sx={{ color: "white", textAlign: "center", p: 4 }}>
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
            src={data[currentIndex]?.webImage.url}
            alt="Expanded View"
            style={{
              maxWidth: "90%",
              maxHeight: "85vh",
              objectFit: "contain",
            }}
          />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {data[currentIndex]?.longTitle}
            </Typography>
            <Typography variant="body2" fontStyle="italic">
              {data[currentIndex].objectDate}
            </Typography>
          </Box>
        </DialogContent>
        <Pagination
          totalItems={data.length}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
        />
        <RijksFavoriteButton artwork={data[currentIndex]} />
      </Dialog>
    </Box>
  );
};
