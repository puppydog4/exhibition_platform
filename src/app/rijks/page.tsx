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
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            fullWidth
          />
        </Search>
      </Box>

      <Box display="flex" gap={2} width="100%" maxWidth={600}>
        <FormControl fullWidth>
          <InputLabel>Century</InputLabel>
          <Select value={century} onChange={(e) => setCentury(e.target.value)}>
            {[...Array(22).keys()].map((c) => (
              <MenuItem key={c} value={c}>
                {c === 0 ? "BC" : `${c}th Century`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="chronological">Chronological</MenuItem>
            <MenuItem value="artist">Artist Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleSearch}
        sx={{ mt: 2 }}
      >
        Search
      </Button>
    </Box>
  );
}
