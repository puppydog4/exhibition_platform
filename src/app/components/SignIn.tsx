'use client'

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { TextField, Button, Alert, Box, Typography } from "@mui/material";

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      alert("Login successful!");
      window.location.href = "/";
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box sx={{ width: "300px", margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Log In</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSignIn}
      >
        Log In
      </Button>
    </Box>
  );
};

export default SignIn;
