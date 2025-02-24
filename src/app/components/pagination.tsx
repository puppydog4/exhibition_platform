// components/Pagination.tsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import FavoriteButton from "./RijksFavouriteButton";

interface PaginationProps {
  totalItems: number;
  currentIndex: number;
  onPageChange: (newIndex: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentIndex,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onPageChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      onPageChange(currentIndex + 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Button
        variant="contained"
        disabled={currentIndex === 0}
        onClick={handlePrevious}
      >
        Previous
      </Button>
      <Typography>
        {currentIndex + 1} / {totalItems}
      </Typography>
      <Button
        variant="contained"
        disabled={currentIndex === totalItems - 1}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
};
