import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui';
import { Box } from '@mui/material';

export const AuthHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Text
        variant="h3"
        weight="bold"
        gradient
        sx={{ mb: 1 }}
      >
        {t('app.title')}
      </Text>
      <Text
        variant="h6"
        color="secondary"
        weight="medium"
        sx={{ mb: 3 }}
      >
        {t('app.tagline')}
      </Text>
    </Box>
  );
};

