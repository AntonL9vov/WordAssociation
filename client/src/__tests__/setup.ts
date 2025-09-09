import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Increase file handle limits for Windows
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  // Set ulimit-like behavior for Windows testing
  process.setMaxListeners(50);
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Don't restore mocks for browser APIs as they need to remain mocked
  // vi.restoreAllMocks();
});

// Mock window.matchMedia
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
});

// Ensure global is also set for environments that might use it
if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'matchMedia', {
    writable: true,
    configurable: true,
    value: mockMatchMedia,
  });
}

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockReturnValue(null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  writable: true,
  configurable: true,
  value: localStorageMock,
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Global MUI icons mock to prevent EMFILE errors
vi.mock('@mui/icons-material', () => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return vi.fn().mockReturnValue(`MockIcon-${prop}`);
      }
      return target[prop as keyof typeof target];
    }
  });
});
