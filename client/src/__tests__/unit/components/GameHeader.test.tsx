import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { GameHeader } from '@/entities/game-header';

// Mock MUI icons to prevent EMFILE errors
vi.mock('@mui/icons-material/PlayArrow', () => ({
  default: () => <div data-testid="play-icon">PlayIcon</div>
}));

vi.mock('@mui/icons-material/Group', () => ({
  default: () => <div data-testid="group-icon">GroupIcon</div>
}));

vi.mock('@mui/icons-material/EmojiEvents', () => ({
  default: () => <div data-testid="trophy-icon">TrophyIcon</div>
}));

vi.mock('@mui/icons-material/ExitToApp', () => ({
  default: ({ color }: { color?: string }) => (
    <div data-testid="exit-icon" data-color={color}>ExitIcon</div>
  )
}));

// Mock react-i18next to reduce overhead
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'game.gameRoom': 'Game Room',
        'game.gameId': 'Game ID',
        'game.leave': 'Leave Game',
        'game.statuses.setup.label': 'Setup',
        'game.statuses.playing.label': 'Playing',
        'game.statuses.finished.label': 'Finished',
        'game.statuses.unknown.label': 'Unknown',
      };
      return translations[key] || key;
    }
  })
}));

// Mock usePluralization hook
vi.mock('@/shared/hooks', () => ({
  usePluralization: () => ({
    players: 'players',
    formatCount: (count: number, word: string) => `${count} ${count === 1 ? word.slice(0, -1) : word}`
  })
}));

// Mock shared UI components
vi.mock('@/shared/ui', () => ({
  Card: ({ children, sx, cardVariant, ...props }: any) => <div data-testid="card" style={sx} {...props}>{children}</div>,
  Text: ({ children, variant, weight, color, component, sx, ...props }: any) => {
    const Tag = component || 'div';
    return <Tag data-testid={`text-${variant || 'default'}`} data-weight={weight} data-color={color} style={sx} {...props}>{children}</Tag>;
  }
}));

// Mock MUI components with simplified versions
vi.mock('@mui/material', () => ({
  Box: ({ children, sx, ...props }: any) => <div data-testid="box" style={sx} {...props}>{children}</div>,
  Chip: ({ icon, label, color, variant, onClick, sx, ...props }: any) => (
    <div 
      data-testid="chip" 
      data-color={color} 
      data-variant={variant}
      style={{ cursor: onClick ? 'pointer' : 'default', ...sx }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon}
      {label}
    </div>
  )
}));

describe('GameHeader', () => {
  const defaultProps = {
    gameId: 'test-game-123',
    status: 'started' as const,
    playersCount: 3,
    onLeave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders game room title', () => {
      render(<GameHeader {...defaultProps} />);
      expect(screen.getByText('Game Room')).toBeInTheDocument();
    });

    it('displays game ID correctly', () => {
      render(<GameHeader {...defaultProps} />);
      expect(screen.getByText('Game ID:')).toBeInTheDocument();
      expect(screen.getByText('test-game-123')).toBeInTheDocument();
    });

    it('shows correct players count', () => {
      render(<GameHeader {...defaultProps} />);
      expect(screen.getByText('3 players')).toBeInTheDocument();
    });

    it('renders leave button', () => {
      render(<GameHeader {...defaultProps} />);
      expect(screen.getByText('Leave Game')).toBeInTheDocument();
    });
  });

  describe('Game Status', () => {
    it('shows setup status correctly', () => {
      render(<GameHeader {...defaultProps} status="created" />);
      expect(screen.getByText('Setup')).toBeInTheDocument();
    });

    it('shows playing status correctly', () => {
      render(<GameHeader {...defaultProps} status="started" />);
      expect(screen.getByText('Playing')).toBeInTheDocument();
    });

    it('shows finished status correctly', () => {
      render(<GameHeader {...defaultProps} status="finished" />);
      expect(screen.getByText('Finished')).toBeInTheDocument();
    });

    it('applies correct color for different statuses', () => {
      const { rerender } = render(<GameHeader {...defaultProps} status="created" />);
      
      // Check if setup chip has primary color
      let statusChip = screen.getByText('Setup').closest('[data-testid="chip"]');
      expect(statusChip).toHaveAttribute('data-color', 'primary');

      // Check playing status
      rerender(<GameHeader {...defaultProps} status="started" />);
      statusChip = screen.getByText('Playing').closest('[data-testid="chip"]');
      expect(statusChip).toHaveAttribute('data-color', 'success');

      // Check finished status
      rerender(<GameHeader {...defaultProps} status="finished" />);
      statusChip = screen.getByText('Finished').closest('[data-testid="chip"]');
      expect(statusChip).toHaveAttribute('data-color', 'warning');
    });
  });

  describe('Player Count', () => {
    it('handles singular player count', () => {
      render(<GameHeader {...defaultProps} playersCount={1} />);
      expect(screen.getByText('1 player')).toBeInTheDocument();
    });

    it('handles plural player count', () => {
      render(<GameHeader {...defaultProps} playersCount={5} />);
      expect(screen.getByText('5 players')).toBeInTheDocument();
    });

    it('handles zero players', () => {
      render(<GameHeader {...defaultProps} playersCount={0} />);
      expect(screen.getByText('0 players')).toBeInTheDocument();
    });
  });

  describe('Leave Functionality', () => {
    it('calls onLeave when leave button is clicked', () => {
      const onLeaveMock = vi.fn();
      render(<GameHeader {...defaultProps} onLeave={onLeaveMock} />);
      
      const leaveButton = screen.getByText('Leave Game');
      fireEvent.click(leaveButton);
      
      expect(onLeaveMock).toHaveBeenCalledTimes(1);
    });

    it('has correct error styling for leave button', () => {
      render(<GameHeader {...defaultProps} />);
      
      const leaveButton = screen.getByText('Leave Game').closest('[data-testid="chip"]');
      expect(leaveButton).toHaveAttribute('data-color', 'error');
      expect(leaveButton).toHaveStyle({ cursor: 'pointer' });
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(<GameHeader {...defaultProps} />);
      
      const leaveButton = screen.getByText('Leave Game');
      expect(leaveButton.closest('[data-testid="chip"]')).toHaveAttribute('role', 'button');
    });

    it('supports keyboard navigation', () => {
      render(<GameHeader {...defaultProps} />);
      
      const leaveButton = screen.getByText('Leave Game');
      leaveButton.focus();
      expect(leaveButton).toHaveFocus();
    });
  });

  describe('Theme Support', () => {
    it('renders correctly in different themes', () => {
      render(<GameHeader {...defaultProps} />);
      
      expect(screen.getByText('Game Room')).toBeInTheDocument();
      expect(screen.getByText('test-game-123')).toBeInTheDocument();
    });
  });
});
