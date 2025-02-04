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
  Typography,
} from "@mui/material";
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

  const { isLoading, isError, data , error } = useQuery({
    queryKey: [
      `https://www.rijksmuseum.nl/api/en/collection?key=`,
      `&q=${encodeURIComponent(query)}`,
      `&ps=100`, 
    ],
    queryFn: fetchRijiksArtWorks,
  });

   

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
      <Button href="/">home</Button>
      <Typography variant="h4" gutterBottom>
        My Page with Pagination
      </Typography>

      {/* Display the current item */}
      <Card sx={{ maxWidth: 600, margin: "auto" }}>
        <CardMedia component="img" image={data[currentIndex].headerImage.url} />
        <CardContent>
          <Typography variant="body1">{data[currentIndex].longTitle}</Typography>
        </CardContent>
      </Card>

      {/* Render Pagination Controls */}
      <Pagination
        totalItems={data.length}
        currentIndex={currentIndex}
        onPageChange={setCurrentIndex}
      />
    </Box>
  );
};
