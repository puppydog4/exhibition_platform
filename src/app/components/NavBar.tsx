"use client";

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#333" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
          >
            Exhibition Curation
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                href="/auth/signup"
                sx={{ textTransform: "none" }}
              >
                Sign Up
              </Button>
              <Button
                color="inherit"
                component={Link}
                href="/auth/signin"
                sx={{ textTransform: "none" }}
              >
                Log In
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                href="/userDashboard"
                sx={{ textTransform: "none" }}
              >
                Your Collections
              </Button>
              <Button
                color="inherit"
                onClick={signOut}
                sx={{ textTransform: "none" }}
              >
                Log Out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
