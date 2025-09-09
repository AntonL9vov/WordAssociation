import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isPhone = useMediaQuery('(max-width: 480px)');
  
  return {
    isMobile,
    isPhone,
    isDesktop: !isMobile,
  };
};

export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
  const { isMobile } = useBreakpoints();
  
  // Simple responsive value selection based on mobile vs desktop
  if (isMobile && values.xs !== undefined) return values.xs;
  if (isMobile && values.sm !== undefined) return values.sm;
  if (!isMobile && values.lg !== undefined) return values.lg;
  if (!isMobile && values.xl !== undefined) return values.xl;
  if (values.md !== undefined) return values.md;
  
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
