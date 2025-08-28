import { useTranslation } from 'react-i18next';
import { pluralize } from '../lib/pluralization';

/**
 * Хук для работы с плюрализацией в контексте i18n
 * Автоматически определяет язык и применяет соответствующие правила
 */
export function usePluralization() {
  const { i18n } = useTranslation();
  const isRussian = i18n.language === 'ru';

  /**
   * Функция для получения правильной формы слова в зависимости от языка
   * @param count - количество
   * @param translationKey - ключ перевода для единственного числа
   * @param forms - формы для русского языка [1, 2-4, 5+]
   */
  const pluralizeByLanguage = (
    count: number,
    translationKey: string,
    forms?: [string, string, string]
  ): string => {
    if (isRussian && forms) {
      return pluralize(count, forms);
    }
    
    // Для английского просто добавляем 's' если больше 1
    const { t } = useTranslation();
    const baseWord = t(translationKey);
    return count === 1 ? baseWord : `${baseWord}s`;
  };

  /**
   * Специализированные функции для часто используемых слов
   */
  const words = (count: number): string => {
    return isRussian 
      ? pluralize(count, ['слово', 'слова', 'слов'])
      : count === 1 ? 'word' : 'words';
  };

  const players = (count: number): string => {
    return isRussian 
      ? pluralize(count, ['игрок', 'игрока', 'игроков'])
      : count === 1 ? 'player' : 'players';
  };

  const rounds = (count: number): string => {
    return isRussian 
      ? pluralize(count, ['раунд', 'раунда', 'раундов'])
      : count === 1 ? 'round' : 'rounds';
  };

  /**
   * Форматирование полной фразы с числом
   */
  const formatCount = (
    count: number,
    wordFunction: (count: number) => string,
    includeNumber: boolean = true
  ): string => {
    const word = wordFunction(count);
    return includeNumber ? `${count} ${word}` : word;
  };

  return {
    pluralizeByLanguage,
    words,
    players,
    rounds,
    formatCount,
    isRussian,
  };
}
