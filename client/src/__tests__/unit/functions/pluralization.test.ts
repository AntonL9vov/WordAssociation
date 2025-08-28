import { pluralize, pluralizeWords, formatCount } from '../../../shared/lib/pluralization';

describe('pluralization', () => {
  describe('pluralize', () => {
    const forms: [string, string, string] = ['слово', 'слова', 'слов'];

    test('should return correct form for 1', () => {
      expect(pluralize(1, forms)).toBe('слово');
    });

    test('should return correct form for 2-4', () => {
      expect(pluralize(2, forms)).toBe('слова');
      expect(pluralize(3, forms)).toBe('слова');
      expect(pluralize(4, forms)).toBe('слова');
    });

    test('should return correct form for 5-20', () => {
      expect(pluralize(5, forms)).toBe('слов');
      expect(pluralize(10, forms)).toBe('слов');
      expect(pluralize(15, forms)).toBe('слов');
      expect(pluralize(20, forms)).toBe('слов');
    });

    test('should handle special cases 11-14', () => {
      expect(pluralize(11, forms)).toBe('слов');
      expect(pluralize(12, forms)).toBe('слов');
      expect(pluralize(13, forms)).toBe('слов');
      expect(pluralize(14, forms)).toBe('слов');
    });

    test('should handle numbers ending with 1 but not 11', () => {
      expect(pluralize(21, forms)).toBe('слово');
      expect(pluralize(31, forms)).toBe('слово');
      expect(pluralize(101, forms)).toBe('слово');
    });

    test('should handle numbers ending with 2-4 but not 12-14', () => {
      expect(pluralize(22, forms)).toBe('слова');
      expect(pluralize(23, forms)).toBe('слова');
      expect(pluralize(24, forms)).toBe('слова');
      expect(pluralize(32, forms)).toBe('слова');
    });

    test('should handle large numbers', () => {
      expect(pluralize(100, forms)).toBe('слов');
      expect(pluralize(121, forms)).toBe('слово');
      expect(pluralize(122, forms)).toBe('слова');
    });

    test('should handle negative numbers', () => {
      expect(pluralize(-1, forms)).toBe('слово');
      expect(pluralize(-2, forms)).toBe('слова');
      expect(pluralize(-5, forms)).toBe('слов');
    });
  });

  describe('pluralizeWords', () => {
    test('should correctly pluralize word "слово"', () => {
      expect(pluralizeWords(1)).toBe('слово');
      expect(pluralizeWords(2)).toBe('слова');
      expect(pluralizeWords(5)).toBe('слов');
      expect(pluralizeWords(21)).toBe('слово');
    });
  });

  describe('formatCount', () => {
    const forms: [string, string, string] = ['слово', 'слова', 'слов'];

    test('should format with number', () => {
      expect(formatCount(1, forms)).toBe('1 слово');
      expect(formatCount(2, forms)).toBe('2 слова');
      expect(formatCount(5, forms)).toBe('5 слов');
    });

    test('should format without number when specified', () => {
      expect(formatCount(1, forms, false)).toBe('слово');
      expect(formatCount(2, forms, false)).toBe('слова');
      expect(formatCount(5, forms, false)).toBe('слов');
    });
  });
});
