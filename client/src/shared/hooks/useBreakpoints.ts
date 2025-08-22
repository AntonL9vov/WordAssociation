import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const useBreakpoints = () => {
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  const current: Breakpoint = isXs ? 'xs' : isSm ? 'sm' : isMd ? 'md' : isLg ? 'lg' : 'xl';
  
  return {
    current,
    isXs,
    isSm, 
    isMd,
    isLg,
    isXl,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isPhone: isXs || isSm,
    isTablet: isMd,
    isDesktop: isLg || isXl,
  };
};

export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
  const { current } = useBreakpoints();
  
  // Порядок приоритета: current -> lg -> md -> sm -> xs -> default
  const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(current);
  
  // Ищем значение начиная с текущего breakpoint и идем вниз
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint]!;
    }
  }
  
  return defaultValue;
};

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);
  
  return orientation;
};
