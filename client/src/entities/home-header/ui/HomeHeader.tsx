import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBreakpoints } from '@/shared/hooks/useBreakpoints';
import { Text } from '@/shared/ui';
import { Box } from '@mui/material';

// Separated style objects for clean mobile optimization
const desktopHeaderStyles = {
  container: { textAlign: 'center', mb: 6 },
  title: { mb: 2 },
  subtitle: { mb: 1 },
};

const mobileHeaderStyles = {
  container: { textAlign: 'center', mb: 2 }, // Reduced margin bottom
  title: { mb: 1 }, // Reduced margin bottom
  subtitle: { mb: 0.5 },
};

export const HomeHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileHeaderStyles : desktopHeaderStyles;
  
  return (
    <Box sx={styles.container}>
      <Text
        variant={isMobile ? "h3" : "h2"}
        weight="bold"
        gradient
        sx={styles.title}
      >
        {t('home.title')}
      </Text>
      <Text
        variant={isMobile ? "body1" : "h6"}
        color="secondary"
        weight="medium"
        sx={styles.subtitle}
      >
        {t('home.subtitle')}
      </Text>
      <Text
        variant={isMobile ? "body2" : "body1"}
        color="muted"
      >
        {t('home.description')}
      </Text>
    </Box>
  );
};

