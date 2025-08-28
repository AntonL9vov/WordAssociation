import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui';
import { Box } from '@mui/material';

export const HomeHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Text
        variant="h2"
        weight="bold"
        gradient
        sx={{ mb: 2 }}
      >
        {t('home.title')}
      </Text>
      <Text
        variant="h6"
        color="secondary"
        weight="medium"
        sx={{ mb: 1 }}
      >
        {t('home.subtitle')}
      </Text>
      <Text
        variant="body1"
        color="muted"
      >
        {t('home.description')}
      </Text>
    </Box>
  );
};

