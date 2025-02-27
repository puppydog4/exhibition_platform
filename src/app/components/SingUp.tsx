"use client";

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { TextField, Button, Alert, Box, Typography } from "@mui/material";

const SignUp = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      window.location.href = "/";
      alert("Sign up successful! Check your email to verify your account.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box sx={{ width: "300px", margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>

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
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignUp;
