/**
 * Функция для склонения слов в русском языке в зависимости от числа
 * 
 * @param count - количество
 * @param forms - массив форм [1, 2-4, 5+] например: ['слово', 'слова', 'слов']
 * @returns правильную форму слова
 */
export function pluralize(count: number, forms: [string, string, string]): string {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Особые случаи для 11-14 (всегда множественное число)
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2]; // много (слов)
  }

  // Правила для последней цифры
  if (lastDigit === 1) {
    return forms[0]; // одно (слово)
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]; // несколько (слова)
  }

  return forms[2]; // много (слов)
}

/**
 * Специализированная функция для склонения слова "слово"
 */
export function pluralizeWords(count: number): string {
  return pluralize(count, ['слово', 'слова', 'слов']);
}

/**
 * Специализированная функция для склонения слова "игрок"
 */
export function pluralizePlayers(count: number): string {
  return pluralize(count, ['игрок', 'игрока', 'игроков']);
}

/**
 * Специализированная функция для склонения слова "раунд"
 */
export function pluralizeRounds(count: number): string {
  return pluralize(count, ['раунд', 'раунда', 'раундов']);
}

/**
 * Функция для создания полной фразы с числом и правильным склонением
 */
export function formatCount(
  count: number, 
  forms: [string, string, string],
  includeNumber: boolean = true
): string {
  const word = pluralize(count, forms);
  return includeNumber ? `${count} ${word}` : word;
}

/**
 * Специальные экспорт-функции для удобства использования в компонентах
 */
export const wordForms = {
  words: (count: number) => formatCount(count, ['слово', 'слова', 'слов']),
  players: (count: number) => formatCount(count, ['игрок', 'игрока', 'игроков']),
  rounds: (count: number) => formatCount(count, ['раунд', 'раунда', 'раундов']),
} as const;
