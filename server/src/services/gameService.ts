import type {
  Game,
  GamesStorage,
  GameService as IGameService,
  Round,
  Word,
} from "../types/game";
import { v4 as uuidv4 } from "uuid";
import { UsersService } from "./usersService";
import { User } from "../types/users";

export class GameService implements IGameService {
  private gamesStorage: GamesStorage;
  private usersService: UsersService;

  constructor(gamesStorage: GamesStorage, usersService: UsersService) {
    this.gamesStorage = gamesStorage;
    this.usersService = usersService;
  }

  getGame(gameId: string): Game {
    const game = this.gamesStorage.getGame(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }
    return game;
  }

  getGames(): Game[] {
    return this.gamesStorage.getGames();
  }

  getPlayer(playerId: string): User {
    const player = this.usersService.getUser(playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    return player;
  }

  isPlayerInGame(gameId: string, playerId: string): Game | null {
    const game = this.getGame(gameId);
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return null;
    }
    return game;
  }

  isPlayerInGameByPlayerId(playerId: string): Game | null {
    const game = this.gamesStorage
      .getGames()
      .find((g) => g.players.some((p) => p.id === playerId));
    if (!game) {
      return null;
    }
    return game;
  }

  getLastRound(gameId: string): Round {
    const game = this.getGame(gameId);
    if (!game.rounds.length) {
      throw new Error(`Game ${gameId} has no rounds`);
    }
    return game.rounds[game.rounds.length - 1];
  }

  startGame(gameId: string, startWord: string): Game {
    const game = this.getGame(gameId);

    if (game.players.length < 2) {
      throw new Error(`Game ${gameId} has less than 2 players`);
    }

    if (game.status === "started") {
      throw new Error(`Game ${gameId} is already started`);
    }

    this.gamesStorage.updateGame(game.id, {
      status: "started",
      startWord,
    });

    this.addRound(gameId);

    return this.getGame(gameId);
  }

  createGame(playerId: string): Game {
    const game = this.gamesStorage.createGame();
    this.addPlayerToGame(game.id, playerId);
    return this.gamesStorage.getGame(game.id) ?? game;
  }

  deleteGame(gameId: string): void {
    this.gamesStorage.deleteGame(gameId);
  }

  addPlayerToGame(gameId: string, playerId: string): Game {
    const game = this.getGame(gameId);
    const player = this.getPlayer(playerId);

    if (game.status === "started") {
      throw new Error(`Game ${gameId} is already started`);
    }

    if (game.status === "finished") {
      throw new Error(`Game ${gameId} is finished`);
    }

    if (this.isPlayerInGame(gameId, playerId)) {
      throw new Error(`Player ${playerId} already in game ${gameId}`);
    }

    this.gamesStorage.updateGame(gameId, {
      players: [...game.players, player],
    });

    return game;
  }

  emitWord(gameId: string, w: string, playerId: string): Word {
    const game = this.getGame(gameId);
    const player = this.getPlayer(playerId);

    if (game.status !== "started") {
      throw new Error(`Game ${gameId} is not started or finished`);
    }

    const word = {
      id: uuidv4(),
      word: w,
      playerId,
      playerName: player.name,
      timestamp: new Date(),
    };

    const lastRound = this.getLastRound(gameId);
    lastRound.words?.push(word);

    this.gamesStorage.updateGame(gameId, {
      rounds: game.rounds,
    });

    this.checkLastRound(gameId);

    return word;
  }

  checkIsRoundFinished(gameId: string): boolean {
    const lastRound = this.getLastRound(gameId);

    return lastRound.words?.length === this.getGame(gameId).players.length;
  }

  checkIsGameFinished(gameId: string): boolean {
    const lastRound = this.getLastRound(gameId);
    return lastRound.words?.every(
      (word) => word.word === lastRound.words[0].word
    );
  }

  finishGame(gameId: string): void {
    const game = this.getGame(gameId);

    this.gamesStorage.updateGame(game.id, {
      status: "finished",
    });
  }

  addRound(gameId: string): void {
    const game = this.getGame(gameId);

    const newRounds = [];

    if (game.rounds.length) {
      newRounds.push(...game.rounds);
    }

    newRounds.push({
      id: uuidv4(),
      words: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.gamesStorage.updateGame(game.id, {
      rounds: newRounds,
    });
  }

  checkLastRound(gameId: string): boolean {
    const isRoundFinished = this.checkIsRoundFinished(gameId);
    if (!isRoundFinished) {
      return false;
    }
    const isGameFinished = this.checkIsGameFinished(gameId);
    if (isGameFinished) {
      this.finishGame(gameId);
      return true;
    }
    this.addRound(gameId);
    return false;
  }

  getGamePlayers(gameId: string): User[] {
    const game = this.getGame(gameId);
    return game.players;
  }
}
