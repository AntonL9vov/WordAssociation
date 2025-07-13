# WebSocket API Examples

Этот файл содержит примеры использования всех WebSocket событий в вашем word association game.

## Подключение к серверу

```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

## Пользовательские события (Users)

### Подключение пользователя

```javascript
// Отправка события подключения
socket.emit('user:connect', 'John Doe');

// Получение подтверждения подключения
socket.on('user:connected', (data) => {
  console.log('User connected:', data.user);
  // Output: { user: { id: 'user-123', name: 'John Doe' } }
});
```

### Отключение пользователя

```javascript
// Отправка события отключения
socket.emit('user:disconnect', 'user-123');

// Получение подтверждения отключения
socket.on('user:disconnected', (data) => {
  console.log('User disconnected:', data.id);
  // Output: { id: 'user-123' }
});
```

### Получение информации о пользователе

```javascript
// Запрос информации о пользователе
socket.emit('user:get', 'user-123');

// Получение информации о пользователе
socket.on('user:got', (data) => {
  console.log('User info:', data.user);
  // Output: { user: { id: 'user-123', name: 'John Doe' } }
});
```

### Обновление информации о пользователе

```javascript
// Обновление информации о пользователе
socket.emit('user:update', {
  id: 'user-123',
  name: 'John Updated'
});

// Получение подтверждения обновления
socket.on('user:updated', (data) => {
  console.log('User updated:', data.user);
  // Output: { user: { id: 'user-123', name: 'John Updated' } }
});
```

## Игровые события (Games)

### Создание игры

```javascript
// Создание новой игры
socket.emit('game:create', 'user-123');

// Получение информации о созданной игре
socket.on('game:created', (game) => {
  console.log('Game created:', game);
  // Output: {
  //   id: 'game-123',
  //   rounds: [],
  //   createdAt: '2023-01-01T00:00:00Z',
  //   updatedAt: '2023-01-01T00:00:00Z',
  //   startWord: '',
  //   isFinished: false,
  //   players: [{ id: 'user-123', name: 'John Doe' }],
  //   isStarted: false
  // }
});

// Обработка ошибки создания игры
socket.on('game:created:error', (error) => {
  console.error('Failed to create game:', error);
  // Output: { message: 'Failed to create game', code: 'GAME_CREATION_ERROR' }
});
```

### Начало игры

```javascript
// Начало игры с начальным словом
socket.emit('game:start', 'game-123', 'hello');

// Получение подтверждения начала игры
socket.on('game:started', (game) => {
  console.log('Game started:', game);
  // Output: {
  //   id: 'game-123',
  //   rounds: [],
  //   createdAt: '2023-01-01T00:00:00Z',
  //   updatedAt: '2023-01-01T00:00:00Z',
  //   startWord: 'hello',
  //   isFinished: false,
  //   players: [{ id: 'user-123', name: 'John Doe' }],
  //   isStarted: true
  // }
});

// Обработка ошибки начала игры
socket.on('game:started:error', (error) => {
  console.error('Failed to start game:', error);
  // Output: { message: 'Game not found or already started', code: 'GAME_START_ERROR' }
});
```

### Присоединение к игре

```javascript
// Присоединение к существующей игре
socket.emit('game:join', 'game-123', 'user-456');

// Получение подтверждения присоединения
socket.on('game:joined', (data) => {
  console.log('Player joined game:', data);
  // Output: { gameId: 'game-123', playerId: 'user-456' }
});

// Обработка ошибки присоединения
socket.on('game:joined:error', (error) => {
  console.error('Failed to join game:', error);
  // Output: { message: 'Game not found or player already in game', code: 'GAME_JOIN_ERROR' }
});
```

### Получение информации об игре

```javascript
// Запрос информации об игре
socket.emit('game:get', 'game-123');

// Получение информации об игре
socket.on('game:got', (game) => {
  console.log('Game info:', game);
  // Output: {
  //   id: 'game-123',
  //   rounds: [],
  //   createdAt: '2023-01-01T00:00:00Z',
  //   updatedAt: '2023-01-01T00:00:00Z',
  //   startWord: 'hello',
  //   isFinished: false,
  //   players: [
  //     { id: 'user-123', name: 'John Doe' },
  //     { id: 'user-456', name: 'Jane Smith' }
  //   ],
  //   isStarted: true
  // }
});
```

### Отправка слова в игре

```javascript
// Отправка слова в игре
socket.emit('game:word', 'game-123', 'user-123', 'world');

// Получение подтверждения отправки слова
socket.on('game:word:emitted', (word) => {
  console.log('Word emitted:', word);
  // Output: {
  //   id: 'word-123',
  //   word: 'world',
  //   playerId: 'user-123',
  //   playerName: 'John Doe',
  //   timestamp: '2023-01-01T00:00:00Z'
  // }
});

// Обработка ошибки отправки слова
socket.on('game:word:emitted:error', (error) => {
  console.error('Failed to emit word:', error);
  // Output: { message: 'Invalid word or game not found', code: 'WORD_EMISSION_ERROR' }
});
```

## Полный пример использования

```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

// Подключение пользователя
socket.emit('user:connect', 'John Doe');

socket.on('user:connected', (data) => {
  const userId = data.user.id;
  console.log('Connected as:', data.user.name);
  
  // Создание игры
  socket.emit('game:create', userId);
});

socket.on('game:created', (game) => {
  console.log('Game created with ID:', game.id);
  
  // Начало игры
  socket.emit('game:start', game.id, 'hello');
});

socket.on('game:started', (game) => {
  console.log('Game started!');
  
  // Отправка слова
  socket.emit('game:word', game.id, game.players[0].id, 'world');
});

socket.on('game:word:emitted', (word) => {
  console.log('Word sent:', word.word);
});

// Обработка ошибок
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

## Типы данных

### User
```typescript
interface User {
  id: string;
  name: string;
}
```

### Game
```typescript
interface Game {
  id: string;
  rounds: Round[];
  createdAt: Date;
  updatedAt: Date;
  startWord: string;
  isFinished: boolean;
  isStarted: boolean;
  players: User[];
}
```

### Word
```typescript
interface Word {
  id: string;
  word: string;
  playerId: string;
  playerName: string;
  timestamp: Date;
}
```

### Round
```typescript
interface Round {
  id: string;
  words: Word[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Error
```typescript
interface Error {
  message: string;
  code: string;
}
```

## Обработка ошибок

Все события могут возвращать ошибки. Всегда обрабатывайте ошибки:

```javascript
// Обработка ошибок для всех событий
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Обработка конкретных ошибок
socket.on('game:created:error', (error) => {
  console.error('Game creation failed:', error.message);
});

socket.on('game:started:error', (error) => {
  console.error('Game start failed:', error.message);
});

socket.on('game:joined:error', (error) => {
  console.error('Join game failed:', error.message);
});

socket.on('game:word:emitted:error', (error) => {
  console.error('Word emission failed:', error.message);
});
``` 