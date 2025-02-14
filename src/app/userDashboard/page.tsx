"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { Typography } from "@mui/material";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  return user ? <Typography variant="h4">Welcome to Your Dashboard</Typography> : null;
}
