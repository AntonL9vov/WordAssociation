import React from 'react';
import { Text } from '@/shared/ui';
import { Box, Chip } from '@mui/material';
import {
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';

const features = [
  "Real-time multiplayer",
  "Word association fun", 
  "Chat with players",
  "Endless rounds"
];

export const AuthFormFeatures: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
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
  );
};

