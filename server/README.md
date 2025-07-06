 # WebSocket API Documentation

Этот сервер автоматически генерирует документацию для всех WebSocket событий.

## Доступные эндпоинты

- **HTML документация**: `http://localhost:3000/docs`
- **JSON документация**: `http://localhost:3000/api/docs`
- **OpenAPI спецификация**: `http://localhost:3000/api/docs/openapi`

## Автоматическое обновление

Документация автоматически обновляется при:
1. Добавлении новых событий в `user-socket-events.ts` или `game-socket-events.ts`
2. Изменении структуры существующих событий
3. Добавлении новых категорий событий

## Структура событий

### Пользовательские события (Users)
- `user:connect` - Подключение пользователя
- `user:disconnect` - Отключение пользователя
- `user:get` - Получение информации о пользователе
- `user:update` - Обновление информации о пользователе

### Игровые события (Games)
- `game:create` - Создание новой игры
- `game:start` - Начало игры
- `game:join` - Присоединение к игре
- `game:get` - Получение информации об игре
- `game:word` - Отправка слова в игре

## Добавление новых событий

1. Добавьте событие в соответствующий файл событий
2. Документация автоматически обновится при следующем запуске сервера
3. Для более детального описания используйте `DocumentationService.registerEvent()`

## Пример использования

```typescript
// Автоматическое извлечение
docService.extractFromSocketEvents(myEvents, 'MyCategory');

// Ручное добавление метаданных
docService.registerEvent('my:event', {
  description: 'My custom event',
  parameters: [
    { name: 'param1', type: 'string', description: 'Parameter description' }
  ],
  category: 'MyCategory',
  direction: 'incoming'
});
``` 