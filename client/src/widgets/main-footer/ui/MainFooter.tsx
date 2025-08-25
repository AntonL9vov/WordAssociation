import React from "react";
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
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-primary)',
        py: 3,
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
            © 2025 Word Association Game. Made with{' '}
            <FavoriteIcon 
              sx={{ 
                fontSize: '1rem', 
                color: 'var(--error-500)',
                verticalAlign: 'middle' 
              }} 
            />{' '}
            for multiplayer fun
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
            <Tooltip title="View on GitHub">
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
