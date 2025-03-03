import React, { useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

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
  // Enable keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        onPageChange(currentIndex - 1);
      }
      if (event.key === "ArrowRight" && currentIndex < totalItems - 1) {
        onPageChange(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalItems, onPageChange]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1.5,
        mt: 3,
      }}
    >
      <IconButton
        color="primary"
        disabled={currentIndex === 0}
        onClick={() => onPageChange(0)}
      >
        <FirstPageIcon />
      </IconButton>

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

      <IconButton
        color="primary"
        disabled={currentIndex === totalItems - 1}
        onClick={() => onPageChange(totalItems - 1)}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};
