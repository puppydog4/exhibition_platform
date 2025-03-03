"use client";

import {
  SearchIconWrapper,
  StyledInputBase,
  Search,
} from "@/app/components/search";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchRijks />
    </QueryClientProvider>
  );
}

function SearchRijks() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [century, setCentury] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    router.push(
      `/SearchRijks?query=${encodeURIComponent(
        searchInput
      )}&century=${century}&sort=${sortBy}`
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={3}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        width="100%"
        maxWidth={800}
      >
        <Search sx={{ flex: 1 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            id="search-input"
            placeholder="Search artworks"
            inputProps={{ "aria-label": "Search artworks" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            fullWidth
          />
        </Search>
      </Box>

      <Box display="flex" gap={2} width="100%" maxWidth={600}>
        <FormControl fullWidth>
          <InputLabel id="century-label">Century</InputLabel>
          <Select
            labelId="century-label"
            value={century}
            onChange={(e) => setCentury(e.target.value)}
            aria-labelledby="century-label"
          >
            <MenuItem value="">All Centuries</MenuItem>
            {Array.from({ length: 21 }, (_, i) => i + 1).map((c) => (
              <MenuItem key={c} value={c}>
                {c === 1 ? "1st Century" : `${c}th Century`}
              </MenuItem>
            ))}
            <MenuItem value="BC">Before Christ (BC)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-labelledby="sort-label"
          >
            <MenuItem value="chronological">Chronological</MenuItem>
            <MenuItem value="artist">Artist Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleSearch}
        disabled={!searchInput.trim()}
        aria-label="Search artwork"
        sx={{ mt: 2 }}
      >
        Search
      </Button>
    </Box>
  );
}
