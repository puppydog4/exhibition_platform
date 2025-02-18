"use client";

import { Typography } from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
  <ProtectedRoute>
    <Typography variant="h4">Welcome to Your Dashboard</Typography>
  </ProtectedRoute>
  
}
