import React from "react";
import { Box, Button, Typography } from "@mui/material";

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
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mt: 3,
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        disabled={currentIndex === 0}
        onClick={() => onPageChange(currentIndex - 1)}
        sx={{ px: 3, py: 1 }}
      >
        Previous
      </Button>
      <Typography variant="body1" fontWeight={600}>
        {currentIndex + 1} / {totalItems}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        disabled={currentIndex === totalItems - 1}
        onClick={() => onPageChange(currentIndex + 1)}
        sx={{ px: 3, py: 1 }}
      >
        Next
      </Button>
    </Box>
  );
};
