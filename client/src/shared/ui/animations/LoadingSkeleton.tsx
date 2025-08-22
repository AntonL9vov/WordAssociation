import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'list' | 'message';
  lines?: number;
  height?: number | string;
  width?: number | string;
  sx?: object;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  lines = 1,
  height,
  width,
  sx = {},
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <Box sx={{ p: 2, ...sx }}>
            <Stack spacing={1}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Stack>
          </Box>
        );
        
      case 'list':
        return (
          <Stack spacing={1} sx={sx}>
            {Array.from({ length: lines }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem' }} />
                </Box>
              </Box>
            ))}
          </Stack>
        );
        
      case 'message':
        return (
          <Stack spacing={1} sx={sx}>
            {Array.from({ length: lines }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="20%" sx={{ fontSize: '0.75rem', mb: 0.5 }} />
                  <Skeleton 
                    variant="rectangular" 
                    height={36} 
                    width={`${Math.random() * 40 + 40}%`}
                    sx={{ borderRadius: 'var(--radius-lg)' }} 
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        );
        
      case 'text':
        return (
          <Stack spacing={0.5} sx={sx}>
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton 
                key={index}
                variant="text" 
                height={height}
                width={index === lines - 1 ? '70%' : width}
              />
            ))}
          </Stack>
        );
        
      case 'rectangular':
        return (
          <Skeleton 
            variant="rectangular" 
            height={height || 140}
            width={width}
            sx={{ borderRadius: 1, ...sx }}
          />
        );
        
      case 'circular':
        return (
          <Skeleton 
            variant="circular" 
            height={height || 40}
            width={width || height || 40}
            sx={sx}
          />
        );
        
      default:
        return <Skeleton variant="text" height={height} width={width} sx={sx} />;
    }
  };

  return renderSkeleton();
};
