"use client";

import DateRangeSlider from "../components/DateRangeSlider";
import fetchArtWorks from "@/utils/fetchArtworks";
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Typography } from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/app/components/search";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <SearchCollection />
      </Suspense>
    </QueryClientProvider>
  );
}

function SearchCollection() {
  const router = useRouter();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "https://collectionapi.metmuseum.org/public/collection/v1/departments",
    ],
    queryFn: fetchArtWorks,
  });

  const [dateRange, setDateRange] = useState<[number, number]>([1000, 2024]);
  const [department, setDepartment] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("sunflowers");
  const [disableSlider, setDisableSlider] = useState(false);

  const handleDepartment = (
    event: React.MouseEvent<HTMLElement>,
    newDepartment: string | null
  ): void => {
    setDepartment(newDepartment);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    if (department) {
      router.push(
        `/SearchMet?query=${encodeURIComponent(
          searchInput
        )}&department=${encodeURIComponent(department)}&dateBegin=${
          dateRange[0]
        }&dateEnd=${dateRange[1]}`
      );
    } else {
      console.log("No department selected");
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", textAlign: "center", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Search the MET Collection
      </Typography>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchInput}
          onChange={handleInputChange}
          required
        />
      </Search>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Select Department
      </Typography>
      <ToggleButtonGroup
        value={department}
        exclusive
        onChange={handleDepartment}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {data.departments.map(
          (department: { displayName: string; departmentId: number }) => (
            <ToggleButton
              key={department.departmentId}
              value={department.departmentId}
              sx={{ p: 1, textTransform: "none" }}
            >
              {department.displayName}
            </ToggleButton>
          )
        )}
      </ToggleButtonGroup>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Date Range
      </Typography>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={disableSlider}
              onChange={(e) => {
                setDisableSlider(e.target.checked);
                setDateRange([-5000, 2024]);
              }}
            />
          }
          label="Disable Date Range"
        />
        <DateRangeSlider
          dateRange={dateRange}
          onChange={setDateRange}
          disabled={disableSlider}
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Selected Range: {dateRange[0]} - {dateRange[1]}
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ mt: 3 }}
        disabled={!department || !searchInput}
      >
        Search
      </Button>
    </Box>
  );
}
