import React from 'react';
import { Text } from '@/shared/ui';
import { Box } from '@mui/material';

export const AuthHeader: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Text
        variant="h3"
        weight="bold"
        gradient
        sx={{ mb: 1 }}
      >
        Word Association
      </Text>
      <Text
        variant="h6"
        color="secondary"
        weight="medium"
        sx={{ mb: 3 }}
      >
        Connect minds through words
      </Text>
    </Box>
  );
};

