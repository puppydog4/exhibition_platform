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
  const [searchInput, setSearchInput] = useState<string>("");
  const [disableSlider, setDisableSlider] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (!department) {
      setErrorMessage("Please select a department before searching.");
      return;
    }
    setErrorMessage(null);
    router.push(
      `/SearchMet?query=${encodeURIComponent(
        searchInput
      )}&department=${encodeURIComponent(department)}&dateBegin=${
        dateRange[0]
      }&dateEnd=${dateRange[1]}`
    );
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
          id="search-input"
          placeholder="Search artworks"
          inputProps={{ "aria-label": "Search artworks" }}
          value={searchInput}
          onChange={handleInputChange}
          required
        />
      </Search>

      <Typography id="department-label" variant="h6" sx={{ mt: 3, mb: 1 }}>
        Select Department
      </Typography>
      <ToggleButtonGroup
        value={department}
        exclusive
        onChange={handleDepartment}
        aria-labelledby="department-label"
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

      {errorMessage && (
        <Typography color="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}

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
              inputProps={{
                "aria-describedby": "date-range-description",
              }}
            />
          }
          label="Disable Date Range"
        />
        <Typography id="date-range-description" variant="body2" sx={{ mb: 2 }}>
          Unchecking allows you to filter by year.
        </Typography>
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
        disabled={!searchInput}
        aria-label="Search the MET collection"
      >
        Search
      </Button>
    </Box>
  );
}
