import React from 'react';
import { Text } from '@/shared/ui';
import { Box } from '@mui/material';

export const HomeHeader: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Text
        variant="h2"
        weight="bold"
        gradient
        sx={{ mb: 2 }}
      >
        Ready to Play?
      </Text>
      <Text
        variant="h6"
        color="secondary"
        weight="medium"
        sx={{ mb: 1 }}
      >
        Choose how you want to start your word adventure
      </Text>
      <Text
        variant="body1"
        color="muted"
      >
        Create a new game or join friends in an existing one
      </Text>
    </Box>
  );
};

