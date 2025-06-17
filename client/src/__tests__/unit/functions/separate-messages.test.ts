import { describe, it, expect } from 'vitest';
import { separateMessages } from '@/entities/game-round/utils/separate-messages';
import { RoundMessages } from '@/entities/game-round/types/round-message';

describe('separateMessages', () => {
  const mockMessages: RoundMessages = {
    round: 1,
    messages: {
      '1': {
        senderId: '1',
        text: 'Hello from self',
        timestamp: new Date(),
        senderName: 'Player 1',
      },
      '2': {
        senderId: '2',
        text: 'Hello from opponent',
        timestamp: new Date(),
        senderName: 'Player 2',
      },
      '3': {
        senderId: '3',
        text: 'Another message from opponent',
        timestamp: new Date(),
        senderName: 'Player 3',
      },
    },
  };

  it('should separate messages into self and opponent messages', () => {
    const result = separateMessages(mockMessages);

    expect(result.selfMessages).toHaveLength(1);
    expect(result.opponentMessages).toHaveLength(2);

    expect(result.selfMessages[0].text).toBe('Hello from self');
    expect(result.opponentMessages[0].text).toBe('Hello from opponent');
    expect(result.opponentMessages[1].text).toBe('Another message from opponent');
  });

  it('should use custom selfId when provided', () => {
    const result = separateMessages(mockMessages, '2');

    expect(result.selfMessages).toHaveLength(1);
    expect(result.opponentMessages).toHaveLength(2);

    expect(result.selfMessages[0].text).toBe('Hello from opponent');
    expect(result.opponentMessages[0].text).toBe('Hello from self');
    expect(result.opponentMessages[1].text).toBe('Another message from opponent');
  });
}); 