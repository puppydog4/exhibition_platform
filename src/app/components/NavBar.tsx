"use client";

import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import Link from "next/link";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: App Name */}
        <Typography variant="h6" component={Link} href="/">Exhibition Curation</Typography>

        {/* Middle: Internal Links */}
        <Box>
          {!user ? (
            <>
              <Button color="inherit" component={Link} href="/auth/signup">
                Sign Up
              </Button>
              <Button color="inherit" component={Link} href="/auth/signin">
                Log In
              </Button>
            </>
          ) : (
            <>
            <Button color="inherit" component={Link} href="/userDashboard">
              Your Collections
            </Button>
            <Button color="inherit" onClick={signOut}>
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
