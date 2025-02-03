"use client";

import { useSearchParams } from "next/navigation";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, Typography, List, ListItem, Button, Card, CardMedia, CardContent } from "@mui/material";
import fetchSearchResults from "@/utils/fetchSearchResultsMet";
import { useEffect, useState } from "react";
import fetchArtworkDetail from "@/utils/fetchArtworkDetailsMet";

const queryClient = new QueryClient();

export default function App() {
    return (
      // Provide the client to your App
      <QueryClientProvider client={queryClient}>
        <SearchResultsPage/>
      </QueryClientProvider>
    );
  }

function SearchResultsPage() {
    // Extract search parameters from the URL
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("query") || "";
    const departmentId = searchParams.get("department") || "";
  
    // Construct the search API URL
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${encodeURIComponent(
      departmentId
    )}&q=${encodeURIComponent(searchTerm)}`;
  
    // Fetch search results (the list of artwork IDs)
    const {
      data: searchData,
      isLoading: searchLoading,
      error: searchError,
    } = useQuery({
      queryKey: [searchUrl],
      queryFn: () => fetchSearchResults(searchUrl),
      enabled: Boolean(searchTerm && departmentId),
    });
  
    // Set up pagination state (index of current artwork)
    const [currentIndex, setCurrentIndex] = useState(0);
  
    // Get the list of objectIDs from the search response
    const objectIDs: number[] = searchData?.objectIDs || [];
    const currentObjectID = objectIDs.length ? objectIDs[currentIndex] : null;
  
    // Access the query client for prefetching
    const queryClient = useQueryClient();
  
    // Fetch details for the current artwork
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
  
    // Prefetch the previous and next artwork details whenever currentIndex changes
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
                image={artworkData.primaryImageSmall || "/placeholder-image.png"}
                alt={artworkData.title}
              />
              <CardContent>
                <Typography variant="h6">{artworkData.title}</Typography>
                <Typography variant="body2">
                  {artworkData.artistDisplayName}
                </Typography>
                <Typography variant="body2">
                  {artworkData.objectDate}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography>No artwork data available.</Typography>
          )}
        </Box>
  
        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Typography>
            {currentIndex + 1} / {objectIDs.length}
          </Typography>
          <Button
            variant="contained"
            disabled={currentIndex === objectIDs.length - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  }