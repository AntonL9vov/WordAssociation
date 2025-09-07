import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { createMuiTheme } from '@/shared/ui/theme/muiTheme';
import { ThemeProvider as CustomThemeProvider } from '@/shared/context/ThemeContext';
import { AuthProvider } from '@/shared/context/AuthContext';
import { vi } from 'vitest';
import i18n from './i18n-test.ts';

// Mock user for testing
const mockUser = {
  id: 'test-user-1',
  name: 'Test User',
  socketId: 'socket-123',
};

// Mock game data
const mockGame = {
  id: 'test-game-1',
  status: 'started' as const,
  players: [mockUser],
  playersEmittedWords: {},
  rounds: [],
  startWord: 'test',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock localStorage for AuthProvider
const setupMockAuth = (user?: any) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

interface AllProvidersProps {
  children: React.ReactNode;
  user?: any;
  theme?: 'light' | 'dark';
}

const AllProviders: React.FC<AllProvidersProps> = ({ 
  children, 
  user = mockUser,
  theme = 'light'
}) => {
  const muiTheme = createMuiTheme();
  
  // Setup mock auth before rendering
  React.useEffect(() => {
    setupMockAuth(user);
  }, [user]);
  
  return (
    <I18nextProvider i18n={i18n}>
      <CustomThemeProvider>
        <ThemeProvider theme={muiTheme}>
          <AuthProvider>
            <div data-theme={theme}>
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: any;
  theme?: 'light' | 'dark';
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { user, theme, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders user={user} theme={theme}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
};

// Mock socket.io client
 const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
  id: 'socket-123',
};

// Helper to wait for async operations
const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock functions for common operations
 const mockFunctions = {
  onSend: vi.fn(),
  onLeave: vi.fn(),
  restartGame: vi.fn(),
  handleSubmit: vi.fn(),
  handleChange: vi.fn(),
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Export our custom render as the default render
export { customRender as render };

// Export test utilities
export { mockUser, mockGame, mockSocket, waitForAsync, mockFunctions };
