'use client'

import { SearchIconWrapper, StyledInputBase , Search } from "@/app/components/search";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <SearchRijks></SearchRijks>
    </QueryClientProvider>
  );
}

function SearchRijks () {
  
    const router = useRouter()

    const handleSearch = () => {
      router.push(`/SearchRijks?query=${encodeURIComponent(
        searchInput
      )}`)
    };
    const [searchInput, setSearchInput] = useState("");
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    };
  
    return (
      <>
        <Box>
          <Button href="/">Home</Button>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchInput}
              onChange={handleInputChange}
            />
          </Search>
        </Box>
        <Box>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Box>
      </>
    );
  }