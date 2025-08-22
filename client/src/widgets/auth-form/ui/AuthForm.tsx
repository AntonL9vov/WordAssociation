import React, { useState } from "react";
import { playerConnect } from "../api/api";
import { User } from "@/shared/lib/types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Fade,
  Chip,
} from "@mui/material";
import {
  SportsCricket as GameIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const user = await playerConnect(playerName.trim());
      onAuthSuccess(user);
    } catch (err) {
      setError("Failed to connect. Please try again.");
      setIsLoading(false);
    }
  };

  const features = [
    "Real-time multiplayer",
    "Word association fun",
    "Chat with players",
    "Endless rounds"
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 50%, var(--accent-50) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 'var(--radius-2xl)',
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
              overflow: 'visible',
              position: 'relative',
            }}
          >
            {/* Декоративный элемент */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)',
              }}
            >
              <GameIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <CardContent sx={{ pt: 6, pb: 4, px: 4 }}>
              {/* Заголовок */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Word Association
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'var(--text-secondary)',
                    fontWeight: 'medium',
                    mb: 3,
                  }}
                >
                  Connect minds through words
                </Typography>

                {/* Фичи */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
                  {features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      icon={<SparkleIcon sx={{ fontSize: '16px !important' }} />}
                      sx={{
                        backgroundColor: 'var(--accent-100)',
                        color: 'var(--accent-700)',
                        fontWeight: 'medium',
                        '& .MuiChip-icon': {
                          color: 'var(--accent-600)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Форма */}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  placeholder="Enter your player name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ color: 'var(--text-muted)', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                />

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--error-50)',
                      border: '1px solid var(--error-200)',
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!playerName.trim() || isLoading}
                  startIcon={<PlayIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                    '&:hover': {
                      background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'var(--neutral-300)',
                      color: 'var(--text-muted)',
                    },
                  }}
                >
                  {isLoading ? "Connecting..." : "Start Playing"}
                </Button>
              </Box>

              {/* Дополнительная информация */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                  Join players from around the world in this fun word game!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};
