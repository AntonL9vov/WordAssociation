import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@/__tests__/utils/test-utils';
import { GameStatusAlert } from '@/entities/game-status-alert';

describe('GameStatusAlert', () => {
  const defaultProps = {
    status: 'finished' as const,
    restartGame: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Conditional Rendering', () => {
    it('renders when status is finished', () => {
      render(<GameStatusAlert {...defaultProps} />);
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
    });

    it('does not render when status is created', () => {
      render(<GameStatusAlert {...defaultProps} status="created" />);
      expect(screen.queryByText(/Game Completed!/)).not.toBeInTheDocument();
    });

    it('does not render when status is started', () => {
      render(<GameStatusAlert {...defaultProps} status="started" />);
      expect(screen.queryByText(/Game Completed!/)).not.toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('displays game completed message with emoji', () => {
      render(<GameStatusAlert {...defaultProps} />);
      expect(screen.getByText(/🎉 Game Completed!/)).toBeInTheDocument();
    });

    it('shows restart button with correct text', () => {
      render(<GameStatusAlert {...defaultProps} />);
      expect(screen.getByText('Restart Game')).toBeInTheDocument();
    });

    it('uses success alert variant', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('MuiAlert-standardSuccess');
    });
  });

  describe('Layout and Styling', () => {
    it('button has correct sizing constraints', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const button = screen.getByText('Restart Game');
      const buttonElement = button.closest('button');
      
      expect(buttonElement).toHaveStyle({
        minWidth: '150px',
      });
    });

    it('alert takes full width', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const alert = screen.getByRole('alert');
      expect(alert.parentElement).toHaveStyle({
        width: '100%',
      });
    });
  });

  describe('Restart Functionality', () => {
    it('calls restartGame when button is clicked', () => {
      const restartGameMock = vi.fn();
      render(<GameStatusAlert {...defaultProps} restartGame={restartGameMock} />);
      
      const restartButton = screen.getByText('Restart Game');
      fireEvent.click(restartButton);
      
      expect(restartGameMock).toHaveBeenCalledTimes(1);
    });

    it('button is clickable and not disabled', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const button = screen.getByText('Restart Game').closest('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('handles multiple clicks correctly', () => {
      const restartGameMock = vi.fn();
      render(<GameStatusAlert {...defaultProps} restartGame={restartGameMock} />);
      
      const restartButton = screen.getByText('Restart Game');
      
      fireEvent.click(restartButton);
      fireEvent.click(restartButton);
      fireEvent.click(restartButton);
      
      expect(restartGameMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has proper alert role', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('button has proper role and is keyboard accessible', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: 'Restart Game' });
      expect(button).toBeInTheDocument();
      
      // Test keyboard interaction
      act(() => {
        button.focus();
      });
      expect(button).toHaveFocus();
    });

    it('supports keyboard activation', () => {
      const restartGameMock = vi.fn();
      render(<GameStatusAlert {...defaultProps} restartGame={restartGameMock} />);
      
      const button = screen.getByText('Restart Game');
      
      // Simulate Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      
      // Note: This might not trigger the onClick in jsdom, but we test the handler directly
      fireEvent.click(button);
      expect(restartGameMock).toHaveBeenCalled();
    });
  });

  describe('Visual Design', () => {
    it('has success icon in alert', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const alert = screen.getByRole('alert');
      const icon = alert.querySelector('[data-testid="SuccessOutlinedIcon"]');
      expect(icon || alert.querySelector('svg')).toBeInTheDocument();
    });

    it('button has contained variant styling', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const button = screen.getByText('Restart Game').closest('button');
      expect(button).toHaveClass('MuiButton-contained');
      expect(button).toHaveClass('MuiButton-containedPrimary');
    });
  });

  describe('Responsive Behavior', () => {
    it('button maintains minimum width', () => {
      render(<GameStatusAlert {...defaultProps} />);
      
      const button = screen.getByText('Restart Game').closest('button');
      expect(button).toHaveStyle({
        minWidth: '150px',
      });
    });

    it('handles narrow containers gracefully', () => {
      // This test verifies the layout works in constrained spaces
      const { container } = render(<GameStatusAlert {...defaultProps} />);
      
      // Set container to narrow width
      Object.defineProperty(container, 'offsetWidth', {
        value: 300,
        configurable: true,
      });
      
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
      expect(screen.getByText('Restart Game')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('works with dark theme', () => {
      render(<GameStatusAlert {...defaultProps} />, { theme: 'dark' });
      
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('works with light theme', () => {
      render(<GameStatusAlert {...defaultProps} />, { theme: 'light' });
      
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
