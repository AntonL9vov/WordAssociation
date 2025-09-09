# Testing Guide

This directory contains comprehensive tests for the Multiplayer Word Game client application.

## Test Structure

```
__tests__/
├── setup.ts                    # Test environment setup
├── utils/
│   ├── test-utils.tsx          # Custom render utilities and mocks
│   └── i18n-test.ts           # Test translations
├── unit/
│   ├── components/            # Component unit tests
│   ├── hooks/                 # Custom hooks tests
│   ├── stores/                # State management tests
│   ├── contexts/              # React context tests
│   └── functions/             # Utility functions tests
└── integration/
    ├── GameFlow.test.tsx      # Game workflow integration tests
    └── ThemeIntegration.test.tsx # Theme system integration tests
```

## Test Categories

### Unit Tests

**Components** (`unit/components/`)
- `GameHeader.test.tsx` - Game header component with status, players, leave functionality
- `GameRound.test.tsx` - Game round display with messages, last round handling
- `GameStatusAlert.test.tsx` - Game completion alert with restart functionality

**Hooks** (`unit/hooks/`)
- `usePluralization.test.ts` - Pluralization logic and formatting

**Stores** (`unit/stores/`)
- `gameStore.test.ts` - Zustand game state management

**Contexts** (`unit/contexts/`)
- `AuthContext.test.tsx` - Authentication state and localStorage persistence

### Integration Tests

**Game Flow** (`integration/GameFlow.test.tsx`)
- Complete game lifecycle (creation → start → finish → restart)
- Multi-component state synchronization
- Player join/leave scenarios
- Error handling across components

**Theme Integration** (`integration/ThemeIntegration.test.tsx`)
- Component rendering in light/dark themes
- CSS variable adaptation
- Interactive elements with themes
- Accessibility across themes

## Testing Utilities

### Custom Render (`test-utils.tsx`)

Enhanced render function with providers:
```typescript
import { render, screen } from '@/test-utils';

// Renders with all providers (Auth, Theme, i18n, MUI)
render(<MyComponent />, { 
  user: mockUser,        // Optional user context
  theme: 'dark'          // Optional theme ('light' | 'dark')
});
```

### Mock Data

- `mockUser` - Test user object
- `mockGame` - Sample game state
- `mockSocket` - Socket.io mock
- `mockFunctions` - Common mock functions

### Test Setup Features

- Automatic cleanup after each test
- Mock window APIs (matchMedia, IntersectionObserver, ResizeObserver)
- localStorage mocking
- Clipboard API mocking

## Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test GameHeader

# Watch mode
npm test -- --watch
```

## Writing Tests

### Component Testing Best Practices

1. **Test user interactions, not implementation details**
   ```typescript
   // ✅ Good - tests behavior
   fireEvent.click(screen.getByText('Leave Game'));
   expect(onLeaveMock).toHaveBeenCalled();
   
   // ❌ Bad - tests implementation
   expect(component.state.clicked).toBe(true);
   ```

2. **Use semantic queries**
   ```typescript
   // ✅ Good - accessible queries
   screen.getByRole('button', { name: 'New Game' })
   screen.getByLabelText('Player count')
   
   // ❌ Bad - fragile queries
   screen.getByClassName('MuiButton-root')
   ```

3. **Test accessibility**
   ```typescript
   const button = screen.getByRole('button');
   button.focus();
   expect(button).toHaveFocus();
   ```

### Store Testing

```typescript
import { useGameStore } from '@/shared/stores/game-store';

describe('GameStore', () => {
  beforeEach(() => {
    useGameStore.setState({ game: null });
  });
  
  it('updates game state', () => {
    const { setGame } = useGameStore.getState();
    setGame(mockGame);
    expect(useGameStore.getState().game).toEqual(mockGame);
  });
});
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react';

describe('usePluralization', () => {
  it('formats count correctly', () => {
    const { result } = renderHook(() => usePluralization());
    expect(result.current.formatCount(1, ['item', 'items', 'items']))
      .toBe('1 item');
  });
});
```

### Integration Testing

```typescript
describe('Game Flow Integration', () => {
  it('handles complete game lifecycle', async () => {
    render(<GameFlowComponent />);
    
    // Start game
    fireEvent.click(screen.getByText('Start Game'));
    await waitFor(() => {
      expect(screen.getByText('Playing')).toBeInTheDocument();
    });
    
    // Finish game
    fireEvent.click(screen.getByText('Finish Game'));
    await waitFor(() => {
      expect(screen.getByText(/Game Completed!/)).toBeInTheDocument();
    });
  });
});
```

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## Mocked External Dependencies

- **Socket.io**: Mocked socket with event emitters
- **i18next**: Test translations in English
- **MUI Theme**: Configured with test theme
- **localStorage**: Mocked browser storage
- **Clipboard API**: Mocked for copy functionality

## Test Data Guidelines

1. **Use descriptive test data**
   ```typescript
   const testGame = {
     id: 'integration-test-game',
     status: 'started',
     // ...
   };
   ```

2. **Keep test data minimal but realistic**
3. **Use factories for complex objects**
4. **Avoid magic numbers/strings**

## Debugging Tests

1. **Use `screen.debug()`** to see rendered DOM
2. **Add `data-testid`** for hard-to-query elements
3. **Use `waitFor()`** for async operations
4. **Check console output** for React warnings

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Coverage reports generated
- Failed tests block deployments

## Common Patterns

### Testing Theme Switching
```typescript
const { rerender } = render(<Component />, { theme: 'light' });
rerender(<Component />); // Uses dark theme
```

### Testing Error States
```typescript
const errorSetGame = vi.fn().mockImplementation(() => {
  throw new Error('Store error');
});
```

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```
