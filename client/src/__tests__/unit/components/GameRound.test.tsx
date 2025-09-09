import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@/__tests__/utils/test-utils";
import { GameRound } from "@/entities/game-round";
import { Word } from "@/shared/lib/types";

// Ensure matchMedia is mocked before any tests run
beforeAll(() => {
  const mockMatchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: mockMatchMedia,
  });

  // Mock localStorage as well
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    writable: true,
    configurable: true,
    value: localStorageMock,
  });
});

describe("GameRound", () => {
  const mockMessages: Word[] = [
    {
      id: "msg-1",
      word: "test",
      playerId: "test-user-1",
      playerName: "test-user-1",
      timestamp: new Date(),
    },
    {
      id: "msg-2",
      word: "example",
      playerId: "other-user-1",
      playerName: "other-user-1",
      timestamp: new Date(),
    },
  ];

  const defaultProps = {
    messages: mockMessages,
    roundNumber: 1,
    isTheLastRound: false,
  };

  describe("Rendering", () => {
    it("renders round title with number", () => {
      render(<GameRound {...defaultProps} />);
      expect(screen.getByText("Round 1")).toBeInTheDocument();
    });

    it("renders without round number when not provided", () => {
      const { roundNumber, ...propsWithoutNumber } = defaultProps;
      render(<GameRound {...propsWithoutNumber} />);
      expect(screen.getByText("Game Round")).toBeInTheDocument();
    });

    it("does not render when no messages", () => {
      render(<GameRound {...defaultProps} messages={[]} />);
      expect(screen.queryByTestId("game-round")).not.toBeInTheDocument();
    });

    it("shows correct message count in description", () => {
      render(<GameRound {...defaultProps} />);
      expect(screen.getByText(/2 words submitted/)).toBeInTheDocument();
    });
  });

  describe("Last Round Styling", () => {
    it("shows match found chip when last round", () => {
      render(<GameRound {...defaultProps} isTheLastRound />);
      expect(screen.getByText("Match Found!")).toBeInTheDocument();
    });

    it("does not show match found chip when not last round", () => {
      render(<GameRound {...defaultProps} isTheLastRound={false} />);
      expect(screen.queryByText("Match Found!")).not.toBeInTheDocument();
    });

    it("applies special styling for last round", () => {
      render(<GameRound {...defaultProps} isTheLastRound />);

      const roundElement = screen.getByTestId("game-round");
      expect(roundElement).toHaveStyle({
        borderColor: expect.stringContaining("success"),
        backgroundColor: expect.stringContaining("success"),
      });
    });

    it("shows winning message for last round", () => {
      render(<GameRound {...defaultProps} isTheLastRound />);
      expect(screen.getByText(/All players chose: "test"/)).toBeInTheDocument();
    });
  });

  describe("Message Separation", () => {
    it("separates self and opponent messages correctly", () => {
      render(<GameRound {...defaultProps} />);

      // Should show "Your Word" section
      expect(screen.getByText("test")).toBeInTheDocument();

      // Should show "Other Players" section
      expect(screen.getByText("example")).toBeInTheDocument();
    });

    it("shows only self messages when user has no opponents", () => {
      const selfOnlyMessages: Word[] = [
        {
          id: "msg-1",
          word: "test",
          playerId: "test-user-1",
          playerName: "test-user-1",
          timestamp: new Date(),
        },
      ];

      render(<GameRound {...defaultProps} messages={selfOnlyMessages} />);

      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.queryByText("example")).not.toBeInTheDocument();
    });

    it("shows only opponent messages when user has not participated", () => {
      const opponentOnlyMessages: Word[] = [
        {
          id: "msg-1",
          word: "test",
          playerId: "other-user-1",
          playerName: "other-user-1",
          timestamp: new Date(),
        },
      ];

      render(<GameRound {...defaultProps} messages={opponentOnlyMessages} />);

      expect(screen.queryByText("Your Word")).not.toBeInTheDocument();
      expect(screen.getByText("Other Players")).toBeInTheDocument();
    });
  });

  describe("Visual Elements", () => {
    it("shows round icon", () => {
      render(<GameRound {...defaultProps} />);

      // Check for icon presence (MUI icon will be rendered)
      const roundElement = screen.getByTestId("game-round");
      const icon = roundElement.querySelector('[data-testid="PlayCircleIcon"]');
      expect(icon || roundElement.querySelector("svg")).toBeInTheDocument();
    });

    it("shows success chip with correct styling for last round", () => {
      render(<GameRound {...defaultProps} isTheLastRound />);

      const matchChip = screen
        .getByText("Match Found!")
        .closest(".MuiChip-root");
      expect(matchChip).toHaveClass("MuiChip-colorSuccess");
      expect(matchChip).toHaveClass("MuiChip-sizeSmall");
    });
  });

  describe("Data Validation", () => {
    it("handles undefined round number", () => {
      const { roundNumber, ...propsWithoutNumber } = defaultProps;

      expect(() => {
        render(<GameRound {...propsWithoutNumber} roundNumber={undefined} />);
      }).not.toThrow();
    });
  });

  describe("Authentication Context", () => {
    it("works with different user contexts", () => {
      const customUser = { id: "different-user", name: "Different User" };

      render(<GameRound {...defaultProps} />, { user: customUser });

      // Should still render but message separation will be different
      expect(screen.getByText("Round 1")).toBeInTheDocument();
    });

    it("works without authenticated user", () => {
      render(<GameRound {...defaultProps} />, { user: null });

      expect(screen.getByText("Round 1")).toBeInTheDocument();
      // All messages should be in "Other Players" section
      expect(screen.getByText("Other Players")).toBeInTheDocument();
    });
  });
});
