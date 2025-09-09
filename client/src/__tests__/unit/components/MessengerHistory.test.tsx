import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessengerHistory } from '@/features/messenger-history';

describe('MessengerHistory', () => {
  it('renders game history', () => {
    render(<MessengerHistory />);
    
    // Проверяем, что компонент отрендерился
    expect(screen.getByTestId('messenger-history')).toBeInTheDocument();
    
    // Проверяем наличие сообщений
    const gameRounds = screen.getAllByTestId('game-round');
    expect(gameRounds.length).toBeGreaterThan(0);

    // Проверяем, что в каждом game-round есть какой-то текст
    gameRounds.forEach((gameRound) => {
      expect(gameRound.textContent).toBeTruthy();
    });
  });
}); 