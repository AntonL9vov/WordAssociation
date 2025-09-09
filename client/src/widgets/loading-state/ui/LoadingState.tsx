import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui';
import { Box, LinearProgress } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message 
}) => {
  const { t } = useTranslation();
  const displayMessage = message || t('common.loading');
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
        {displayMessage}
      </Text>
    </Box>
  );
};

