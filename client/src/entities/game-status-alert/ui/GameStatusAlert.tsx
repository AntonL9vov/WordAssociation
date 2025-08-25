import React from 'react';
import { Alert } from '@mui/material';
import { Text } from '@/shared/ui';

interface GameStatusAlertProps {
  status: 'created' | 'started' | 'finished';
}

export const GameStatusAlert: React.FC<GameStatusAlertProps> = ({ status }) => {
  if (status !== 'finished') {
    return null;
  }

  return (
    <Alert 
      severity="success" 
      sx={{ 
        mt: 2,
        borderRadius: 'var(--radius-lg)',
        '& .MuiAlert-icon': {
          fontSize: '24px',
        },
      }}
    >
      <Text variant="body1" weight="medium">
        🎉 Game completed! Great job everyone!
      </Text>
    </Alert>
  );
};

