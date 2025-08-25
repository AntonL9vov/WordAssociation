import React from 'react';
import { GameActionCard } from '@/entities/game-action-card';
import { Stack } from '@mui/material';
import {
  Rocket as RocketIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

interface GameSelectionActionsProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
}

export const GameSelectionActions: React.FC<GameSelectionActionsProps> = ({
  onCreateGame,
  onJoinGame,
}) => {
  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={3}
      sx={{ 
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      <GameActionCard
        title="Create Game"
        description="Start a new game and invite friends to join your word association adventure"
        icon={<RocketIcon />}
        buttonText="Create New Game"
        colorScheme="primary"
        onClick={onCreateGame}
      />

      <GameActionCard
        title="Join Game"
        description="Enter a game ID to join an existing game with friends and other players"
        icon={<GroupIcon />}
        buttonText="Join Existing Game"
        colorScheme="secondary"
        onClick={onJoinGame}
      />
    </Stack>
  );
};

