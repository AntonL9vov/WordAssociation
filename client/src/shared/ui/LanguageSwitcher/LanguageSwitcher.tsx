import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-primary)',
  borderRadius: 'var(--radius-md)',
  '& .MuiToggleButton-root': {
    border: 'none',
    color: 'var(--text-secondary)',
    fontWeight: 'var(--font-weight-medium)',
    fontSize: '0.875rem',
    padding: '8px 16px',
    '&.Mui-selected': {
      backgroundColor: 'var(--primary-600)',
      color: 'var(--text-inverse)',
      '&:hover': {
        backgroundColor: 'var(--primary-700)',
      },
    },
    '&:hover': {
      backgroundColor: 'var(--primary-50)',
    },
  },
}));

interface LanguageSwitcherProps {
  size?: 'small' | 'medium';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  size = 'medium' 
}) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    _: React.MouseEvent<HTMLElement>,
    newLanguage: string | null
  ) => {
    if (newLanguage) {
      i18n.changeLanguage(newLanguage);
    }
  };

  return (
    <Box>
      <StyledToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={handleLanguageChange}
        size={size}
        aria-label="language selection"
      >
        <ToggleButton value="en" aria-label="english">
          EN
        </ToggleButton>
        <ToggleButton value="ru" aria-label="russian">
          RU
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};
