import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip } from '@mui/material';
import {
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';

export const AuthFormFeatures: React.FC = () => {
  const { t } = useTranslation();
  
  const features = [
    t('auth.features.realtime'),
    t('auth.features.wordFun'),
    t('auth.features.chat'),
    t('auth.features.endless')
  ];
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

