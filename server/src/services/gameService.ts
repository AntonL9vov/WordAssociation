import { io } from "../index";
import {
  Game,
  GameState,
  GameEventType,
  GameEvent,
  Player,
} from "../types/game";


export class GameService {
  private static instance: GameService;
  private games: Record<string, Game | undefined>;
  private constructor() {
    this.games = {};
  }

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  createGame(): string {
    const gameId = Math.random().toString(36).substring(2);
    this.games[gameId] = {
      id: gameId,
      players: [],
      currentRound: 0,
      state: GameState.WAITING_FOR_PLAYERS,
      lastWord: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return gameId;
  }

  joinGame(gameId: string, playerId: string, playerName: string): Game {
    const game = this.games[gameId];
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.players.length >= 2) {
      throw new Error("Game is full");
    }

    game.players.push({
      id: playerId,
      name: playerName,
      words: [],
    });

    game.updatedAt = new Date();

    // Start game if we have 2 players
    if (game.players.length === 2) {
      this.startInitialWordsRound(game);
    }

    return game;
  }

  private startInitialWordsRound(game: Game): void {
    game.state = GameState.INITIAL_WORDS;
    game.currentRound = 1;

    const event: GameEvent = {
      type: GameEventType.ROUND_STARTED,
      data: { round: game.currentRound, state: game.state },
      gameId: game.id,
    };

    io.to(game.id).emit("game-update", event);
  }

  submitWord(gameId: string, playerId: string, word: string): void {
    const game = this.games[gameId];
    if (!game) {
      throw new Error("Game not found");
    }

    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    // Check if it's the initial words round
    if (game.state === GameState.INITIAL_WORDS) {
      if (player.words.length > 0) {
        throw new Error("Player already submitted a word");
      }
      player.words.push(word);

      // If both players submitted words, start association round
      if (game.players.every((p) => p.words.length > 0)) {
        this.startAssociationRound(game);
      }
    } else if (game.state === GameState.ASSOCIATION_ROUND) {
      player.words.push(word);

      // Check if both players submitted words
      if (game.players.every((p) => p.words.length === game.currentRound)) {
        this.checkForWinner(game);
      }
    }

    game.updatedAt = new Date();

    const event: GameEvent = {
      type: GameEventType.WORD_SUBMITTED,
      data: { word, round: game.currentRound },
      gameId: game.id,
    };

    io.to(game.id).emit("game-update", event);
  }

  private startAssociationRound(game: Game): void {
    game.state = GameState.ASSOCIATION_ROUND;
    game.currentRound++;
    game.lastWord = null;

    const event: GameEvent = {
      type: GameEventType.ROUND_STARTED,
      data: { round: game.currentRound, state: game.state },
      gameId: game.id,
    };

    io.to(game.id).emit("game-update", event);
  }

  private checkForWinner(game: Game): void {
    const player1 = game.players[0];
    const player2 = game.players[1];
    const lastWord1 = player1.words[player1.words.length - 1];
    const lastWord2 = player2.words[player2.words.length - 1];

    if (lastWord1 === lastWord2) {
      game.state = GameState.GAME_OVER;
      game.lastWord = lastWord1;

      const event: GameEvent = {
        type: GameEventType.GAME_ENDED,
        data: {
          winner: null, // No winner in this game type
          rounds: game.currentRound,
          initialWords: [player1.words[0], player2.words[0]],
          finalWord: lastWord1,
        },
        gameId: game.id,
      };

      io.to(game.id).emit("game-update", event);
    }
  }

  removePlayer(gameId: string, playerId: string): void {
    const game = this.games[gameId];
    if (!game) {
      return;
    }

    game.players = game.players.filter((p) => p.id !== playerId);
    game.updatedAt = new Date();

    if (game.players.length === 0) {
      this.deleteGame(gameId);
    } else if (game.players.length === 1) {
      game.state = GameState.WAITING_FOR_PLAYERS;
    }

    const event: GameEvent = {
      type: GameEventType.PLAYER_LEFT,
      data: { playerId },
      gameId: game.id,
    };

    io.to(game.id).emit("game-update", event);
  }

  getGame(gameId: string): Game | undefined {
    return this.games[gameId];
  }

  deleteGame(gameId: string): void {
    this.games[gameId] = undefined;
  }
}
