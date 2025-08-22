import React, { useState } from "react";
import { JoinGame } from "@/features";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Fade,
  Zoom,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import {
  Add as CreateIcon,
  Login as JoinIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  Rocket as RocketIcon,
} from "@mui/icons-material";

export type CurrentStep = "create" | "join" | null;

export type EnterGameFormsProps = {
  onJoinGame: (gameId?: string) => void;
};

export const EnterGameForms: React.FC<EnterGameFormsProps> = ({ onJoinGame }) => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(null);

  const handleCreateGame = () => {
    onJoinGame();
  };

  const handleJoinGame = (gameId?: string) => {
    onJoinGame(gameId);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        py: 4,
      }}
    >
      {currentStep === null && (
        <Fade in timeout={600}>
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            {/* Заголовок */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Play?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'var(--text-secondary)',
                  fontWeight: 'medium',
                  mb: 1,
                }}
              >
                Choose how you want to start your word adventure
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--text-muted)',
                }}
              >
                Create a new game or join friends in an existing one
              </Typography>
            </Box>

            {/* Карточки действий */}
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3}
              sx={{ 
                alignItems: 'stretch',
                justifyContent: 'center',
              }}
            >
              {/* Создать игру */}
              <Zoom in timeout={800} style={{ transitionDelay: '100ms' }}>
                <Card
                  sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', md: 280 },
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(14, 165, 233, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                    },
                  }}
                  onClick={handleCreateGame}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <RocketIcon sx={{ fontSize: 36, color: 'var(--primary-600)' }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Create Game
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-secondary)',
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      Start a new game and invite friends to join your word association adventure
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<CreateIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                        fontWeight: 'bold',
                        py: 1,
                        px: 3,
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                        },
                      }}
                    >
                      Create New Game
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>

              {/* Присоединиться к игре */}
              <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
                <Card
                  sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', md: 280 },
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                    },
                  }}
                  onClick={() => setCurrentStep("join")}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-100), var(--accent-200))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <GroupIcon sx={{ fontSize: 36, color: 'var(--accent-600)' }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Join Game
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-secondary)',
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      Enter a game ID to join an existing game with friends and other players
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<JoinIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
                        fontWeight: 'bold',
                        py: 1,
                        px: 3,
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--accent-600), var(--accent-700))',
                        },
                      }}
                    >
                      Join Existing Game
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Stack>
          </Box>
        </Fade>
      )}

      {currentStep === "join" && (
        <Fade in timeout={400}>
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <IconButton
                    onClick={() => setCurrentStep(null)}
                    sx={{
                      mr: 2,
                      backgroundColor: 'var(--bg-tertiary)',
                      '&:hover': {
                        backgroundColor: 'var(--bg-secondary)',
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Join Game
                  </Typography>
                </Box>
                <JoinGame onJoinGame={handleJoinGame} />
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}
    </Box>
  );
};
