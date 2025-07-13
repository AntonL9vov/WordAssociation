"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGame = void 0;
const usersService_1 = require("./services/usersService");
const base_socket_1 = require("./socket-entities/base-socket");
const usersStorage_1 = require("./storages/usersStorage");
const UsersSocket_1 = require("./socket-entities/users-socket/UsersSocket");
const GameSocket_1 = require("./socket-entities/game-scoket/GameSocket");
const gamesStorage_1 = require("./storages/gamesStorage");
const gameService_1 = require("./services/gameService");
const documentationService_1 = require("./services/documentationService");
const documentationMiddleware_1 = require("./middleware/documentationMiddleware");
const user_socket_events_1 = require("./socket-entities/users-socket/user-socket-events");
const game_socket_events_1 = require("./socket-entities/game-scoket/game-socket-events");
const api_1 = require("./api");
const initialUsersState = [
    {
        id: "1",
        name: "John Doe",
    },
    {
        id: "2",
        name: "Jane Doe",
    },
];
const initialGamesState = {
    "1": {
        id: "1",
        rounds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        startWord: "",
        isFinished: false,
        players: [
            {
                id: "1",
                name: "John Doe",
            },
            {
                id: "2",
                name: "Jane Doe",
            },
        ],
        isStarted: false,
    },
};
class BaseGame {
    constructor() {
        this.userStorage = new usersStorage_1.UsersStorage(initialUsersState);
        this.usersService = new usersService_1.UsersService(this.userStorage);
        this.userSocket = new UsersSocket_1.UsersSocket(this.usersService);
        this.gameStorage = new gamesStorage_1.GamesStorage(initialGamesState);
        this.gameService = new gameService_1.GameService(this.gameStorage, this.usersService);
        this.gameSocket = new GameSocket_1.GameSocket(this.gameService);
        // Инициализация документации
        this.docService = documentationService_1.DocumentationService.getInstance();
        this.docMiddleware = new documentationMiddleware_1.DocumentationMiddleware();
        // Автоматическое извлечение метаданных событий
        this.setupDocumentation();
        this.baseSocket = new base_socket_1.BaseSocket([this.userSocket, this.gameSocket]);
        // Добавляем документацию в Express
        this.baseSocket.setupDocumentation(this.docMiddleware);
        // Создаем REST API сервер
        this.apiServer = (0, api_1.createApiServer)(this.usersService);
    }
    /**
     * Настраивает автоматическое извлечение документации из событий
     */
    setupDocumentation() {
        // Регистрируем события пользователей
        this.docService.extractFromSocketEvents(user_socket_events_1.userSocketEvents, 'Users');
        // Регистрируем события игр
        this.docService.extractFromSocketEvents(game_socket_events_1.gameSocketEvents, 'Games');
        // Добавляем дополнительные метаданные для более детального описания
        this.addDetailedMetadata();
    }
    /**
     * Добавляет детальные метаданные для событий
     */
    addDetailedMetadata() {
        // Пользовательские события
        this.docService.registerEvent('user:connect', {
            description: 'Connect a new user to the system',
            parameters: [
                { name: 'name', type: 'string', description: 'User name', required: true, example: 'John Doe' }
            ],
            response: {
                type: 'object',
                description: 'User object with ID and name',
                example: {
                    user: {
                        id: 'user-123',
                        name: 'John Doe'
                    }
                }
            },
            category: 'Users',
            direction: 'incoming'
        });
        this.docService.registerEvent('user:connected', {
            description: 'Emitted when a user successfully connects',
            response: {
                type: 'object',
                description: 'Connected user information',
                example: {
                    user: {
                        id: 'user-123',
                        name: 'John Doe'
                    }
                }
            },
            category: 'Users',
            direction: 'outgoing'
        });
        this.docService.registerEvent('user:disconnect', {
            description: 'Disconnect a user from the system',
            parameters: [
                { name: 'id', type: 'string', description: 'User ID to disconnect', required: true, example: 'user-123' }
            ],
            response: {
                type: 'object',
                description: 'Disconnection confirmation',
                example: { id: 'user-123' }
            },
            category: 'Users',
            direction: 'incoming'
        });
        this.docService.registerEvent('user:disconnected', {
            description: 'Emitted when a user disconnects',
            response: {
                type: 'object',
                description: 'Disconnected user ID',
                example: { id: 'user-123' }
            },
            category: 'Users',
            direction: 'outgoing'
        });
        this.docService.registerEvent('user:get', {
            description: 'Get user information by ID',
            parameters: [
                { name: 'id', type: 'string', description: 'User ID', required: true, example: 'user-123' }
            ],
            response: {
                type: 'object',
                description: 'User information',
                example: {
                    user: {
                        id: 'user-123',
                        name: 'John Doe'
                    }
                }
            },
            category: 'Users',
            direction: 'incoming'
        });
        this.docService.registerEvent('user:got', {
            description: 'Emitted when user information is retrieved',
            response: {
                type: 'object',
                description: 'User information',
                example: {
                    user: {
                        id: 'user-123',
                        name: 'John Doe'
                    }
                }
            },
            category: 'Users',
            direction: 'outgoing'
        });
        this.docService.registerEvent('user:update', {
            description: 'Update user information',
            parameters: [
                { name: 'user', type: 'User', description: 'Updated user object', required: true, example: { id: 'user-123', name: 'John Updated' } }
            ],
            response: {
                type: 'object',
                description: 'Updated user information',
                example: {
                    user: {
                        id: 'user-123',
                        name: 'John Updated'
                    }
                }
            },
            category: 'Users',
            direction: 'incoming'
        });
        this.docService.registerEvent('user:updated', {
            description: 'Emitted when user information is updated',
            response: {
                type: 'object',
                description: 'Updated user information',
                example: {
                    user: {
                        id: 'user-123',
                        name: 'John Updated'
                    }
                }
            },
            category: 'Users',
            direction: 'outgoing'
        });
        // Игровые события
        this.docService.registerEvent('game:create', {
            description: 'Create a new game',
            parameters: [
                { name: 'playerId', type: 'string', description: 'ID of the player creating the game', required: true, example: 'user-123' }
            ],
            response: {
                type: 'object',
                description: 'Created game object',
                example: {
                    id: 'game-123',
                    rounds: [],
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    startWord: '',
                    isFinished: false,
                    players: [{ id: 'user-123', name: 'John Doe' }],
                    isStarted: false
                }
            },
            category: 'Games',
            direction: 'incoming'
        });
        this.docService.registerEvent('game:created', {
            description: 'Emitted when a new game is created',
            response: {
                type: 'object',
                description: 'Created game object',
                example: {
                    id: 'game-123',
                    rounds: [],
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    startWord: '',
                    isFinished: false,
                    players: [{ id: 'user-123', name: 'John Doe' }],
                    isStarted: false
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:created:error', {
            description: 'Emitted when game creation fails',
            response: {
                type: 'object',
                description: 'Error information',
                example: {
                    message: 'Failed to create game',
                    code: 'GAME_CREATION_ERROR'
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:start', {
            description: 'Start a game with a starting word',
            parameters: [
                { name: 'gameId', type: 'string', description: 'Game ID', required: true, example: 'game-123' },
                { name: 'startWord', type: 'string', description: 'Starting word for the game', required: true, example: 'hello' }
            ],
            response: {
                type: 'object',
                description: 'Started game object',
                example: {
                    id: 'game-123',
                    rounds: [],
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    startWord: 'hello',
                    isFinished: false,
                    players: [{ id: 'user-123', name: 'John Doe' }],
                    isStarted: true
                }
            },
            category: 'Games',
            direction: 'incoming'
        });
        this.docService.registerEvent('game:started', {
            description: 'Emitted when a game starts',
            response: {
                type: 'object',
                description: 'Started game object',
                example: {
                    id: 'game-123',
                    rounds: [],
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    startWord: 'hello',
                    isFinished: false,
                    players: [{ id: 'user-123', name: 'John Doe' }],
                    isStarted: true
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:started:error', {
            description: 'Emitted when game start fails',
            response: {
                type: 'object',
                description: 'Error information',
                example: {
                    message: 'Game not found or already started',
                    code: 'GAME_START_ERROR'
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:join', {
            description: 'Join an existing game',
            parameters: [
                { name: 'gameId', type: 'string', description: 'Game ID to join', required: true, example: 'game-123' },
                { name: 'playerId', type: 'string', description: 'Player ID joining the game', required: true, example: 'user-456' }
            ],
            response: {
                type: 'object',
                description: 'Join confirmation',
                example: {
                    gameId: 'game-123',
                    playerId: 'user-456'
                }
            },
            category: 'Games',
            direction: 'incoming'
        });
        this.docService.registerEvent('game:joined', {
            description: 'Emitted when a player joins a game',
            response: {
                type: 'object',
                description: 'Join confirmation',
                example: {
                    gameId: 'game-123',
                    playerId: 'user-456'
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:joined:error', {
            description: 'Emitted when joining a game fails',
            response: {
                type: 'object',
                description: 'Error information',
                example: {
                    message: 'Game not found or player already in game',
                    code: 'GAME_JOIN_ERROR'
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:get', {
            description: 'Get game information by ID',
            parameters: [
                { name: 'gameId', type: 'string', description: 'Game ID', required: true, example: 'game-123' }
            ],
            response: {
                type: 'object',
                description: 'Game information',
                example: {
                    id: 'game-123',
                    rounds: [],
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    startWord: 'hello',
                    isFinished: false,
                    players: [
                        { id: 'user-123', name: 'John Doe' },
                        { id: 'user-456', name: 'Jane Smith' }
                    ],
                    isStarted: true
                }
            },
            category: 'Games',
            direction: 'incoming'
        });
        this.docService.registerEvent('game:got', {
            description: 'Emitted when game information is retrieved',
            response: {
                type: 'object',
                description: 'Game information',
                example: {
                    id: 'game-123',
                    rounds: [],
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    startWord: 'hello',
                    isFinished: false,
                    players: [
                        { id: 'user-123', name: 'John Doe' },
                        { id: 'user-456', name: 'Jane Smith' }
                    ],
                    isStarted: true
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:word', {
            description: 'Emit a word in the game',
            parameters: [
                { name: 'gameId', type: 'string', description: 'Game ID', required: true, example: 'game-123' },
                { name: 'playerId', type: 'string', description: 'Player ID', required: true, example: 'user-123' },
                { name: 'word', type: 'string', description: 'Word to emit', required: true, example: 'world' }
            ],
            response: {
                type: 'object',
                description: 'Emitted word object',
                example: {
                    id: 'word-123',
                    word: 'world',
                    playerId: 'user-123',
                    playerName: 'John Doe',
                    timestamp: '2023-01-01T00:00:00Z'
                }
            },
            category: 'Games',
            direction: 'incoming'
        });
        this.docService.registerEvent('game:word:emitted', {
            description: 'Emitted when a word is successfully emitted',
            response: {
                type: 'object',
                description: 'Emitted word object',
                example: {
                    id: 'word-123',
                    word: 'world',
                    playerId: 'user-123',
                    playerName: 'John Doe',
                    timestamp: '2023-01-01T00:00:00Z'
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
        this.docService.registerEvent('game:word:emitted:error', {
            description: 'Emitted when word emission fails',
            response: {
                type: 'object',
                description: 'Error information',
                example: {
                    message: 'Invalid word or game not found',
                    code: 'WORD_EMISSION_ERROR'
                }
            },
            category: 'Games',
            direction: 'outgoing'
        });
    }
    // Добавляем метод для запуска REST API сервера
    startApiServer(port = 3001) {
        this.apiServer.listen(port, () => {
            console.log(`REST API server is running on port ${port}`);
            console.log(`API endpoints available at http://localhost:${port}/api`);
        });
    }
}
exports.BaseGame = BaseGame;
