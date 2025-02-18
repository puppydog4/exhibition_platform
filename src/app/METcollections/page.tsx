"use client";
import fetchArtWorks from "@/utils/fetchArtworks";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button } from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import{ useRouter } from "next/navigation";
import { Search, SearchIconWrapper, StyledInputBase } from "@/app/components/search";



const queryClient = new QueryClient();

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <SearchCollection/>
    </QueryClientProvider>
  );
}

function SearchCollection() {
  const router = useRouter()
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "https://collectionapi.metmuseum.org/public/collection/v1/departments",
    ],
    queryFn: fetchArtWorks,
  });

  const [department, setDepartment] = useState<string | null>("");

  const handleDepartment = (
    event: React.MouseEvent<HTMLElement>,
    newDepartment: string | null
  ) => {
    setDepartment(newDepartment);
  };

  const handleSearch = () => {
    if (department) {
      // Redirect to the search page with query parameters
      router.push(
        `/search?query=${encodeURIComponent(
          searchInput
        )}&department=${encodeURIComponent(department)}`
      );
    } else {
      console.log("No department selected");
      // Optionally, display a message to the user here
    }
  };
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <Box>
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
        <ToggleButtonGroup
          value={department}
          exclusive
          onChange={handleDepartment}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            p: 1,
            m: 1,
            bgcolor: "background.paper",
            maxWidth: 3000,
            borderRadius: 1,
          }}
        >
          {data.departments.map(
            (department: { displayName: string; departmentId: number }) => {
              return (
                <ToggleButton
                  key={department.departmentId}
                  value={department.departmentId}
                  sx={{ m: 1, p: 1 }}
                >
                  {department.displayName}
                </ToggleButton>
              );
            }
          )}
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
    </>
  );
}
