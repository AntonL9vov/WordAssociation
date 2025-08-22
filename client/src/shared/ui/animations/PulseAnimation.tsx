import React, { ReactNode } from 'react';
import { Box, keyframes } from '@mui/material';

const pulseKeyframes = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const glowKeyframes = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.6), 0 0 30px rgba(14, 165, 233, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
  }
`;

const bounceKeyframes = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-8px,0);
  }
  70% {
    transform: translate3d(0,-4px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
`;

interface PulseAnimationProps {
  children: ReactNode;
  type?: 'pulse' | 'glow' | 'bounce';
  duration?: number;
  infinite?: boolean;
  sx?: object;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  type = 'pulse',
  duration = 2000,
  infinite = true,
  sx = {},
}) => {
  const getAnimation = () => {
    const animationCount = infinite ? 'infinite' : '1';
    
    switch (type) {
      case 'glow':
        return `${glowKeyframes} ${duration}ms ease-in-out ${animationCount}`;
      case 'bounce':
        return `${bounceKeyframes} ${duration}ms ease-in-out ${animationCount}`;
      case 'pulse':
      default:
        return `${pulseKeyframes} ${duration}ms ease-in-out ${animationCount}`;
    }
  };

  return (
    <Box
      sx={{
        animation: getAnimation(),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
