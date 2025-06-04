export interface Player {
    id: string;
    name: string;
    words: string[];
}

export interface Game {
    id: string;
    players: Player[];
    currentRound: number;
    state: GameState;
    lastWord: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export enum GameState {
    WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
    INITIAL_WORDS = 'INITIAL_WORDS',
    ASSOCIATION_ROUND = 'ASSOCIATION_ROUND',
    GAME_OVER = 'GAME_OVER'
}

export interface GameEvent {
    type: GameEventType;
    data: any;
    gameId: string;
}

export enum GameEventType {
    PLAYER_JOINED = 'PLAYER_JOINED',
    PLAYER_LEFT = 'PLAYER_LEFT',
    WORD_SUBMITTED = 'WORD_SUBMITTED',
    ROUND_STARTED = 'ROUND_STARTED',
    GAME_ENDED = 'GAME_ENDED'
}

export interface GameStats {
    gameId: string;
    winner: Player | null;
    rounds: number;
    initialWords: string[];
    finalWord: string;
    duration: number;
}
