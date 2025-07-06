import { UsersService } from "./services/usersService";
import { BaseSocket } from "./socket-entities/base-socket";
import { UsersStorage } from "./storages/usersStorage";
import { UsersSocket } from "./socket-entities/users-socket/UsersSocket";
import { GameSocket } from "./socket-entities/game-scoket/GameSocket";
import { GamesStorage } from "./storages/gamesStorage";
import { GameService } from "./services/gameService";
import { DocumentationService } from "./services/documentationService";
import { DocumentationMiddleware } from "./middleware/documentationMiddleware";
import { userSocketEvents } from "./socket-entities/users-socket/user-socket-events";
import { gameSocketEvents } from "./socket-entities/game-scoket/game-socket-events";
import { User } from "./types/users";
import { Game } from "./types/game";

const initialUsersState: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
];

const initialGamesState: Record<string, Game> = {
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

export class BaseGame {
  private userStorage: UsersStorage;
  private usersService: UsersService;
  private userSocket: UsersSocket;

  private gameStorage: GamesStorage;
  private gameService: GameService;
  private gameSocket: GameSocket;

  private baseSocket: BaseSocket;
  private docService: DocumentationService;
  private docMiddleware: DocumentationMiddleware;

  constructor() {
    this.userStorage = new UsersStorage(initialUsersState);
    this.usersService = new UsersService(this.userStorage);
    this.userSocket = new UsersSocket(this.usersService);

    this.gameStorage = new GamesStorage(initialGamesState);
    this.gameService = new GameService(this.gameStorage, this.usersService);
    this.gameSocket = new GameSocket(this.gameService);

    // Инициализация документации
    this.docService = DocumentationService.getInstance();
    this.docMiddleware = new DocumentationMiddleware();
    
    // Автоматическое извлечение метаданных событий
    this.setupDocumentation();

    this.baseSocket = new BaseSocket([this.userSocket, this.gameSocket]);
    
    // Добавляем документацию в Express
    this.baseSocket.setupDocumentation(this.docMiddleware);
  }

  /**
   * Настраивает автоматическое извлечение документации из событий
   */
  private setupDocumentation(): void {
    // Регистрируем события пользователей
    this.docService.extractFromSocketEvents(userSocketEvents, 'Users');
    
    // Регистрируем события игр
    this.docService.extractFromSocketEvents(gameSocketEvents, 'Games');
    
    // Добавляем дополнительные метаданные для более детального описания
    this.addDetailedMetadata();
  }

  /**
   * Добавляет детальные метаданные для событий
   */
  private addDetailedMetadata(): void {
    // Пользовательские события
    this.docService.registerEvent('user:connect', {
      description: 'Connect a new user to the system',
      parameters: [
        { name: 'name', type: 'string', description: 'User name', required: true, example: 'John Doe' }
      ],
      response: {
        type: 'object',
        description: 'User object with ID and name',
        example: { user: { id: '123', name: 'John Doe' } }
      },
      category: 'Users',
      direction: 'incoming'
    });

    this.docService.registerEvent('user:connected', {
      description: 'Emitted when a user successfully connects',
      response: {
        type: 'object',
        description: 'Connected user information',
        example: { user: { id: '123', name: 'John Doe' } }
      },
      category: 'Users',
      direction: 'outgoing'
    });

    // Игровые события
    this.docService.registerEvent('game:create', {
      description: 'Create a new game',
      parameters: [
        { name: 'playerId', type: 'string', description: 'ID of the player creating the game', required: true, example: '123' }
      ],
      response: {
        type: 'object',
        description: 'Created game object',
        example: { id: 'game-123', players: [], isStarted: false }
      },
      category: 'Games',
      direction: 'incoming'
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
        example: { id: 'game-123', isStarted: true, startWord: 'hello' }
      },
      category: 'Games',
      direction: 'incoming'
    });

    this.docService.registerEvent('game:word', {
      description: 'Emit a word in the game',
      parameters: [
        { name: 'gameId', type: 'string', description: 'Game ID', required: true, example: 'game-123' },
        { name: 'playerId', type: 'string', description: 'Player ID', required: true, example: '123' },
        { name: 'word', type: 'string', description: 'Word to emit', required: true, example: 'world' }
      ],
      response: {
        type: 'object',
        description: 'Emitted word object',
        example: { id: 'word-123', word: 'world', playerId: '123', timestamp: '2023-01-01T00:00:00Z' }
      },
      category: 'Games',
      direction: 'incoming'
    });
  }
}
