import React, { ReactNode } from 'react';
import { Box, Grow, Slide, Fade, Zoom, Collapse } from '@mui/material';

export type AnimationType = 'fade' | 'slide' | 'grow' | 'zoom' | 'collapse';
export type SlideDirection = 'up' | 'down' | 'left' | 'right';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: AnimationType;
  direction?: SlideDirection;
  delay?: number;
  duration?: number;
  in?: boolean;
  unmountOnExit?: boolean;
  sx?: object;
}

const getSlideDirection = (direction: SlideDirection) => {
  switch (direction) {
    case 'up':
      return { direction: 'up' };
    case 'down':
      return { direction: 'down' };
    case 'left':
      return { direction: 'left' };
    case 'right':
      return { direction: 'right' };
    default:
      return { direction: 'up' };
  }
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 300,
  in: inProp = true,
  unmountOnExit = false,
  sx = {},
}) => {
  const commonProps = {
    in: inProp,
    timeout: duration,
    style: { transitionDelay: `${delay}ms` },
    unmountOnExit,
  };

  const renderContent = () => {
    switch (animation) {
      case 'slide':
        return (
          <Slide {...commonProps} {...getSlideDirection(direction)}>
            <Box sx={sx}>{children}</Box>
          </Slide>
        );
      case 'grow':
        return (
          <Grow {...commonProps}>
            <Box sx={sx}>{children}</Box>
          </Grow>
        );
      case 'zoom':
        return (
          <Zoom {...commonProps}>
            <Box sx={sx}>{children}</Box>
          </Zoom>
        );
      case 'collapse':
        return (
          <Collapse {...commonProps}>
            <Box sx={sx}>{children}</Box>
          </Collapse>
        );
      case 'fade':
      default:
        return (
          <Fade {...commonProps}>
            <Box sx={sx}>{children}</Box>
          </Fade>
        );
    }
  };

  return renderContent();
};

// Хук для последовательной анимации списка элементов
export const useStaggeredAnimation = (items: any[], delay: number = 100) => {
  return items.map((item, index) => ({
    ...item,
    delay: index * delay,
  }));
};
