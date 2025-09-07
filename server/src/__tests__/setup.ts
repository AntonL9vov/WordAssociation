import { beforeEach } from 'vitest';

// Global test setup
beforeEach(() => {
  // Reset any global state if needed
  // Clear console spies if any
});

// Mock Date for consistent testing
export const mockDate = new Date('2023-01-01T00:00:00Z');

// Helper to mock Date.now()
export const mockDateNow = () => {
  const originalDate = global.Date;
  global.Date = class extends originalDate {
    constructor() {
      super();
      return mockDate;
    }
    static now() {
      return mockDate.getTime();
    }
  } as any;
  
  return () => {
    global.Date = originalDate;
  };
};