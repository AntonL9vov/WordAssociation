import React from 'react';
import { Text } from '@/shared/ui';
import { Box, LinearProgress } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '50vh'
    }}>
      <LinearProgress sx={{ width: '100%', maxWidth: 400, mb: 2 }} />
      <Text variant="h6" color="secondary">
        {message}
      </Text>
    </Box>
  );
};

