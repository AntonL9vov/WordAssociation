import { useEffect, useRef, useCallback } from 'react';

// Хук для управления фокусом
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);
  
  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
      focusRef.current = element;
    }
  }, []);
  
  const restoreFocus = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);
  
  return { setFocus, restoreFocus };
};

// Хук для trap фокуса внутри элемента
export const useFocusTrap = (isActive: boolean = true) => {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Устанавливаем фокус на первый элемент
    firstFocusable?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  
  return containerRef;
};

// Хук для анонса изменений screen reader'у
export const useScreenReaderAnnouncement = () => {
  const announcementRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Создаем элемент для анонсов
    const element = document.createElement('div');
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.style.position = 'absolute';
    element.style.left = '-10000px';
    element.style.width = '1px';
    element.style.height = '1px';
    element.style.overflow = 'hidden';
    
    document.body.appendChild(element);
    announcementRef.current = element;
    
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);
  
  const announce = useCallback((message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  }, []);
  
  return announce;
};

// Хук для проверки предпочтений пользователя по анимации
export const useReducedMotion = () => {
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion;
};

// Хук для управления escape key
export const useEscapeKey = (callback: () => void, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [callback, isActive]);
};

// Хук для ARIA-описаний
export const useAriaDescribedBy = (description: string) => {
  const id = useRef(`aria-desc-${Math.random().toString(36).substr(2, 9)}`);
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!description) return;
    
    // Создаем скрытый элемент с описанием
    const descElement = document.createElement('div');
    descElement.id = id.current;
    descElement.textContent = description;
    descElement.style.position = 'absolute';
    descElement.style.left = '-10000px';
    descElement.style.width = '1px';
    descElement.style.height = '1px';
    descElement.style.overflow = 'hidden';
    
    document.body.appendChild(descElement);
    
    return () => {
      document.body.removeChild(descElement);
    };
  }, [description]);
  
  return {
    'aria-describedby': description ? id.current : undefined,
    ref: elementRef,
  };
};
