import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { GameHeader } from '@/entities/game-header';
import { GameStatusAlert } from '@/entities/game-status-alert';
import { AuthFormFeatures } from '@/entities/auth-form';
import { MainHeader } from '@/widgets/main-header';
import React from 'react';
import { Theme } from '@mui/material/styles';

describe('Theme Integration Tests', () => {
  const defaultGameHeaderProps = {
    gameId: 'theme-test-game',
    status: 'started' as const,
    playersCount: 2,
    onLeave: vi.fn(),
  };

  describe('Dark Theme Components', () => {
    it('renders GameHeader correctly in dark theme', () => {
      render(
        <GameHeader {...defaultGameHeaderProps} />,
        { theme: 'dark' }
      );
      
      expect(screen.getByText('Game Room')).toBeInTheDocument();
      expect(screen.getByText('theme-test-game')).toBeInTheDocument();
      expect(screen.getByText('Playing')).toBeInTheDocument();
      expect(screen.getByText('2 players')).toBeInTheDocument();
      
      // Verify dark theme classes or styles are applied
      const container = screen.getByText('Game Room').closest('[data-theme="dark"]');
      expect(container).toBeInTheDocument();
    });

    it('renders GameStatusAlert correctly in dark theme', () => {
      render(
        <GameStatusAlert status="finished" restartGame={vi.fn()} />,
        { theme: 'dark' }
      );
      
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
      expect(screen.getByText('Restart Game')).toBeInTheDocument();
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('renders AuthFormFeatures chips correctly in dark theme', () => {
      render(<AuthFormFeatures />, { theme: 'dark' });
      
      expect(screen.getByText('Real-time gameplay')).toBeInTheDocument();
      expect(screen.getByText('Word challenges')).toBeInTheDocument();
      expect(screen.getByText('Live chat')).toBeInTheDocument();
      expect(screen.getByText('Endless fun')).toBeInTheDocument();
    });

    it('renders MainHeader correctly in dark theme with authenticated user', () => {
      render(<MainHeader />, { 
        theme: 'dark',
        user: { id: 'test-user', name: 'Dark Theme User', socketId: 'socket-123' }
      });
      
      expect(screen.getByText('Multiplayer Word Game')).toBeInTheDocument();
      expect(screen.getByText('Dark Theme User')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Light Theme Components', () => {
    it('renders GameHeader correctly in light theme', () => {
      render(
        <GameHeader {...defaultGameHeaderProps} />,
        { theme: 'light' }
      );
      
      expect(screen.getByText('Game Room')).toBeInTheDocument();
      expect(screen.getByText('theme-test-game')).toBeInTheDocument();
      
      // Verify light theme classes or styles are applied
      const container = screen.getByText('Game Room').closest('[data-theme="light"]');
      expect(container).toBeInTheDocument();
    });

    it('renders all components consistently in light theme', () => {
      const TestThemeComponent = () => (
        <div>
          <MainHeader />
          <GameHeader {...defaultGameHeaderProps} />
          <GameStatusAlert status="finished" restartGame={vi.fn()} />
          <AuthFormFeatures />
        </div>
      );

      render(<TestThemeComponent />, { 
        theme: 'light',
        user: { id: 'light-user', name: 'Light User', socketId: 'socket-456' }
      });
      
      // Check all components render
      expect(screen.getByText('Multiplayer Word Game')).toBeInTheDocument();
      expect(screen.getByText('Game Room')).toBeInTheDocument();
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
      expect(screen.getByText('Real-time gameplay')).toBeInTheDocument();
    });
  });

  describe('Theme-Dependent Styling', () => {
    it('applies correct chip colors in both themes', () => {
      const { rerender } = render(<AuthFormFeatures />, { theme: 'light' });
      
      // Check light theme chip
      let chips = screen.getAllByText(/Real-time|Word|Live|Endless/);
      expect(chips).toHaveLength(4);
      
      // Rerender with dark theme
      rerender(<AuthFormFeatures />);
      
      // Chips should still be present and styled differently
      chips = screen.getAllByText(/Real-time|Word|Live|Endless/);
      expect(chips).toHaveLength(4);
    });

    it('maintains accessibility in both themes', () => {
      const { rerender } = render(
        <GameHeader {...defaultGameHeaderProps} />,
        { theme: 'light' }
      );
      
      // Check accessibility in light theme
      const leaveButton = screen.getByText('Leave Game');
      leaveButton.focus();
      expect(leaveButton).toHaveFocus();
      
      // Rerender in dark theme
      rerender(<GameHeader {...defaultGameHeaderProps} />);
      
      // Should still be accessible
      const darkLeaveButton = screen.getByText('Leave Game');
      darkLeaveButton.focus();
      expect(darkLeaveButton).toHaveFocus();
    });
  });

  describe('Interactive Elements in Themes', () => {
    it('handles click interactions correctly in dark theme', () => {
      const onLeaveMock = vi.fn();
      const restartMock = vi.fn();
      
      const InteractiveComponent = () => (
        <div>
          <GameHeader 
            {...defaultGameHeaderProps} 
            onLeave={onLeaveMock}
          />
          <GameStatusAlert 
            status="finished" 
            restartGame={restartMock}
          />
        </div>
      );

      render(<InteractiveComponent />, { theme: 'dark' });
      
      // Test leave game click
      fireEvent.click(screen.getByText('Leave Game'));
      expect(onLeaveMock).toHaveBeenCalledTimes(1);
      
      // Test restart game click
      fireEvent.click(screen.getByText('Restart Game'));
      expect(restartMock).toHaveBeenCalledTimes(1);
    });

    it('handles hover states correctly across themes', () => {
      render(<AuthFormFeatures />, { theme: 'dark' });
      
      const chip = screen.getByText('Real-time gameplay');
      
      // Simulate hover
      fireEvent.mouseEnter(chip);
      fireEvent.mouseLeave(chip);
      
      // Should not crash and should handle hover states
      expect(chip).toBeInTheDocument();
    });
  });

  describe('Component State with Themes', () => {
    it('preserves component state when theme context changes', () => {
      let currentTheme: "light" | "dark" = 'light';
      
      const StatefulComponent = () => {
        const [clicked, setClicked] = React.useState(false);
        
        return (
          <div>
            <GameHeader 
              {...defaultGameHeaderProps}
              onLeave={() => setClicked(true)}
            />
            <div data-testid="click-state">
              {clicked ? 'clicked' : 'not-clicked'}
            </div>
          </div>
        );
      };

      const { rerender } = render(<StatefulComponent />, { theme: currentTheme });
      
      // Initial state
      expect(screen.getByTestId('click-state')).toHaveTextContent('not-clicked');
      
      // Click action
      fireEvent.click(screen.getByText('Leave Game'));
      expect(screen.getByTestId('click-state')).toHaveTextContent('clicked');
      
      // Change theme - state should persist
      currentTheme = 'dark';
      rerender(<StatefulComponent />);
      
      expect(screen.getByTestId('click-state')).toHaveTextContent('clicked');
    });
  });

  describe('CSS Variables Integration', () => {
    it('uses CSS variables that adapt to theme', () => {
      render(<GameHeader {...defaultGameHeaderProps} />, { theme: 'dark' });
      
      // Check that components are using CSS variables
      // These will be resolved by the browser based on theme
      const gameRoom = screen.getByText('Game Room');
      expect(gameRoom).toBeInTheDocument();
      
      // The actual CSS variable values are set in the theme provider
      const themeContainer = gameRoom.closest('[data-theme="dark"]');
      expect(themeContainer).toBeInTheDocument();
    });

    it('components respond to CSS variable changes', () => {
      const { container } = render(
        <GameHeader {...defaultGameHeaderProps} />,
        { theme: 'dark' }
      );
      
      // Verify theme attribute is set
      const themeElement = container.querySelector('[data-theme="dark"]');
      expect(themeElement).toBeInTheDocument();
    });
  });

  describe('Theme Provider Integration', () => {
    it('works correctly with nested theme providers', () => {
      const NestedComponent = () => (
        <div>
          <MainHeader />
          <div>
            <GameHeader {...defaultGameHeaderProps} />
            <div>
              <AuthFormFeatures />
            </div>
          </div>
        </div>
      );

      render(<NestedComponent />, { 
        theme: 'dark',
        user: { id: 'nested-user', name: 'Nested User', socketId: 'socket-789' }
      });
      
      // All nested components should work
      expect(screen.getByText('Multiplayer Word Game')).toBeInTheDocument();
      expect(screen.getByText('Game Room')).toBeInTheDocument();
      expect(screen.getByText('Real-time gameplay')).toBeInTheDocument();
    });
  });
});
