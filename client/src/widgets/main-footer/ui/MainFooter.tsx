import React from "react";
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton,
  Tooltip 
} from "@mui/material";
import { 
  GitHub as GitHubIcon,
  Favorite as FavoriteIcon 
} from "@mui/icons-material";

export const MainFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-primary)',
        py: 1,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Копирайт */}
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-muted)',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © 2025 Word Association Game
          </Typography>

          {/* Ссылки и иконки */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-muted)',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Open Source
            </Typography>
            <Tooltip title={t('common.viewOnGitHub')}>
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-muted)',
                  '&:hover': {
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-tertiary)',
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
