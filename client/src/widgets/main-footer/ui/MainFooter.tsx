import React from "react";
import { useTranslation } from 'react-i18next';
import { useBreakpoints } from '@/shared/hooks/useBreakpoints';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton,
  Tooltip 
} from "@mui/material";
import { 
  GitHub as GitHubIcon
} from "@mui/icons-material";

export const MainFooter: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-primary)',
        py: isMobile ? 0.5 : 0.75,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Always single row
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            minHeight: isMobile ? 40 : 48,
          }}
        >
          {/* Копирайт */}
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-muted)',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            © 2025 Word Association Game
          </Typography>

          {/* Ссылки и иконки */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                Open Source
              </Typography>
            )}
            <Tooltip title={t('common.viewOnGitHub')}>
              <IconButton
                size="small"
                sx={{
                  color: 'var(--text-muted)',
                  width: isMobile ? 32 : 36,
                  height: isMobile ? 32 : 36,
                  '&:hover': {
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-tertiary)',
                  },
                }}
              >
                <GitHubIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
