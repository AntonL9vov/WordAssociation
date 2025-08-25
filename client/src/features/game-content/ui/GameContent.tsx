import React from 'react';
import { StartGame } from "@/widgets/start-game/ui/StartGame";
import { GameMessenger } from "@/widgets";
import { Box, Fade } from '@mui/material';

interface GameContentProps {
  gameStatus: 'created' | 'started' | 'finished';
}

export const GameContent: React.FC<GameContentProps> = ({ gameStatus }) => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {gameStatus === "created" && (
        <Fade in timeout={400} style={{ transitionDelay: '200ms' }}>
          <Box>
            <StartGame />
          </Box>
        </Fade>
      )}
      
      {(gameStatus === "started" || gameStatus === "finished") && (
        <Fade in timeout={400} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <GameMessenger />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

