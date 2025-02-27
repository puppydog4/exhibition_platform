"use client";

import { Slider, Box, Typography } from "@mui/material";

const DateRangeSlider = ({
  dateRange,
  onChange,
  disabled,
}: {
  dateRange: [number, number];
  onChange: (newRange: [number, number]) => void;
  disabled: boolean;
}) => {
  const handleChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange(newValue as [number, number]);
    }
  };

  // Determines dynamic step size
  const getStepSize = (value: number) => (value < 0 ? 1000 : 100);

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Select Date Range
      </Typography>
      <Slider
        value={dateRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={-5000}
        max={2024}
        step={getStepSize(Math.min(...dateRange))} // Dynamically adjust step
        marks={[
          { value: -5000, label: "5000 BC" },
          { value: -1000, label: "1000 BC" },
          { value: 0, label: "1 AD" },
          { value: 1000, label: "11th" },
          { value: 2000, label: "21st" },
        ]}
        disabled={disabled}
      />
    </Box>
  );
};

export default DateRangeSlider;
