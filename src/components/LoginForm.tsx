"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          p: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to MyApp
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 400, opacity: 0.9 }}>
          Manage everything in one place with our secure and fast dashboard.
        </Typography>
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            width: "100%",
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.9)",
            animation: "fadeIn 0.8s ease-out",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 3,
              color: "primary.main",
            }}
          >
            {isRegistering ? "Create Account" : "Sign In"}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              disabled={loading}
              InputProps={{
                startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              InputProps={{
                startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={isRegistering ? <PersonAddIcon /> : <LoginIcon />}
              sx={{
                py: 1.4,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Login"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <Link
                  component="button"
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  sx={{ ml: 1, cursor: "pointer" }}
                >
                  {isRegistering ? "Sign In" : "Create Account"}
                </Link>
              </Typography>
            </Box>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}
