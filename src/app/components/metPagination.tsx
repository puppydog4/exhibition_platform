import { Box, Button, Typography } from "@mui/material";
import React from "react";
interface MetPaginationProps {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  objectIDs: number[];
}

export function MetPagination({
  currentIndex,
  setCurrentIndex,
  objectIDs,
}: MetPaginationProps) {
  return (
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
        onClick={() => setCurrentIndex((prev: number) => prev - 1)}
      >
        Previous
      </Button>
      <Typography>
        {currentIndex + 1} / {objectIDs.length}
      </Typography>
      <Button
        variant="contained"
        disabled={currentIndex === objectIDs.length - 1}
        onClick={() => setCurrentIndex((prev: number) => prev + 1)}
      >
        Next
      </Button>
    </Box>
  );
}
