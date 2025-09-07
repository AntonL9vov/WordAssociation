import { Pool } from 'pg';
import { Game, GamesStorage as IGameStorage, Round, Word } from "../../types/game";
import { User } from "../../types/users";
import { DatabaseConnection } from '../../config/database';
import { v4 as uuidv4 } from "uuid";

export class PostgresGamesStorage implements IGameStorage {
  private pool: Pool;

  constructor() {
    this.pool = DatabaseConnection.getInstance().getPool();
  }

  async getGame(gameId: string): Promise<Game | undefined> {
    const client = await this.pool.connect();
    
    try {
      // Get game basic info
      const gameQuery = `
        SELECT id, start_word, status, created_at, updated_at 
        FROM games 
        WHERE id = $1
      `;
      const gameResult = await client.query(gameQuery, [gameId]);
      
      if (gameResult.rows.length === 0) {
        return undefined;
      }

      const gameRow = gameResult.rows[0];

      // Get game players
      const playersQuery = `
        SELECT u.id, u.name 
        FROM users u
        INNER JOIN game_players gp ON u.id = gp.user_id
        WHERE gp.game_id = $1
        ORDER BY gp.joined_at
      `;
      const playersResult = await client.query(playersQuery, [gameId]);
      const players: User[] = playersResult.rows.map(row => ({
        id: row.id,
        name: row.name,
      }));

      // Get rounds with words
      const roundsQuery = `
        SELECT r.id, r.round_number, r.created_at, r.updated_at,
               w.id as word_id, w.word, w.user_id as word_user_id, 
               w.timestamp as word_timestamp, u.name as user_name
        FROM rounds r
        LEFT JOIN words w ON r.id = w.round_id
        LEFT JOIN users u ON w.user_id = u.id
        WHERE r.game_id = $1
        ORDER BY r.round_number, w.timestamp
      `;
      const roundsResult = await client.query(roundsQuery, [gameId]);

      // Build rounds structure
      const roundsMap = new Map<string, Round>();
      
      roundsResult.rows.forEach(row => {
        if (!roundsMap.has(row.id)) {
          roundsMap.set(row.id, {
            id: row.id,
            words: [],
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          });
        }

        if (row.word_id) {
          const round = roundsMap.get(row.id)!;
          round.words.push({
            id: row.word_id,
            word: row.word,
            playerId: row.word_user_id,
            playerName: row.user_name,
            timestamp: row.word_timestamp,
          });
        }
      });

      const rounds = Array.from(roundsMap.values());

      // Get current round submissions for playersEmittedWords
      const submissionsQuery = `
        SELECT user_id, word 
        FROM player_round_submissions 
        WHERE game_id = $1 
        AND round_id = (
          SELECT id FROM rounds 
          WHERE game_id = $1 
          ORDER BY round_number DESC 
          LIMIT 1
        )
      `;
      const submissionsResult = await client.query(submissionsQuery, [gameId]);
      
      const playersEmittedWords: { [playerId: string]: string } = {};
      submissionsResult.rows.forEach(row => {
        playersEmittedWords[row.user_id] = row.word;
      });

      return {
        id: gameRow.id,
        rounds,
        createdAt: gameRow.created_at,
        updatedAt: gameRow.updated_at,
        startWord: gameRow.start_word || '',
        status: gameRow.status,
        players,
        playersEmittedWords,
      };

    } catch (error) {
      console.error('Error getting game:', error);
      throw new Error(`Failed to get game: ${error}`);
    } finally {
      client.release();
    }
  }

  async createGame(): Promise<Game> {
    try {
      const query = `
        INSERT INTO games (status) 
        VALUES ('created') 
        RETURNING id, start_word, status, created_at, updated_at
      `;
      const result = await this.pool.query(query);
      
      const row = result.rows[0];
      return {
        id: row.id,
        rounds: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        startWord: row.start_word || '',
        status: row.status,
        players: [],
        playersEmittedWords: {},
      };
    } catch (error) {
      console.error('Error creating game:', error);
      throw new Error(`Failed to create game: ${error}`);
    }
  }

  async deleteGame(gameId: string): Promise<void> {
    try {
      const query = 'DELETE FROM games WHERE id = $1';
      const result = await this.pool.query(query, [gameId]);
      
      if (result.rowCount === 0) {
        throw new Error(`Game with id ${gameId} not found`);
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      throw new Error(`Failed to delete game: ${error}`);
    }
  }

  async getGames(): Promise<Game[]> {
    try {
      const query = `
        SELECT id, start_word, status, created_at, updated_at 
        FROM games 
        ORDER BY created_at DESC
      `;
      const result = await this.pool.query(query);
      
      const games: Game[] = [];
      
      for (const row of result.rows) {
        const game = await this.getGame(row.id);
        if (game) {
          games.push(game);
        }
      }
      
      return games;
    } catch (error) {
      console.error('Error getting all games:', error);
      throw new Error(`Failed to get all games: ${error}`);
    }
  }

  async updateGame(
    gameId: string,
    gameUpdate: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>
  ): Promise<Game> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update basic game fields if provided
      if (gameUpdate.startWord !== undefined || gameUpdate.status !== undefined) {
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        let paramIndex = 1;

        if (gameUpdate.startWord !== undefined) {
          updateFields.push(`start_word = $${paramIndex++}`);
          updateValues.push(gameUpdate.startWord);
        }

        if (gameUpdate.status !== undefined) {
          updateFields.push(`status = $${paramIndex++}`);
          updateValues.push(gameUpdate.status);
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        updateValues.push(gameId);

        const updateQuery = `
          UPDATE games 
          SET ${updateFields.join(', ')} 
          WHERE id = $${paramIndex}
        `;
        await client.query(updateQuery, updateValues);
      }

      // Update players if provided
      if (gameUpdate.players) {
        // Remove existing players
        await client.query('DELETE FROM game_players WHERE game_id = $1', [gameId]);
        
        // Add new players
        for (const player of gameUpdate.players) {
          await client.query(
            'INSERT INTO game_players (game_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [gameId, player.id]
          );
        }
      }

      // Update rounds if provided
      if (gameUpdate.rounds !== undefined) {
        if (gameUpdate.rounds.length === 0) {
          // Clear all rounds for restart functionality
          await client.query('DELETE FROM words WHERE round_id IN (SELECT id FROM rounds WHERE game_id = $1)', [gameId]);
          await client.query('DELETE FROM rounds WHERE game_id = $1', [gameId]);
          await client.query('DELETE FROM player_round_submissions WHERE game_id = $1', [gameId]);
        } else {
          // For non-empty rounds array, warn about direct update
          console.warn('Direct rounds update not fully supported in PostgreSQL storage. Use addRound() method instead.');
        }
      }

      // Update players emitted words if provided
      if (gameUpdate.playersEmittedWords) {
        // Get current round
        const currentRoundQuery = `
          SELECT id FROM rounds 
          WHERE game_id = $1 
          ORDER BY round_number DESC 
          LIMIT 1
        `;
        const currentRoundResult = await client.query(currentRoundQuery, [gameId]);
        
        if (currentRoundResult.rows.length > 0) {
          const currentRoundId = currentRoundResult.rows[0].id;
          
          // Clear existing submissions for current round
          await client.query(
            'DELETE FROM player_round_submissions WHERE game_id = $1 AND round_id = $2',
            [gameId, currentRoundId]
          );
          
          // Add new submissions
          for (const [playerId, word] of Object.entries(gameUpdate.playersEmittedWords)) {
            await client.query(
              `INSERT INTO player_round_submissions (game_id, user_id, round_id, word) 
               VALUES ($1, $2, $3, $4)`,
              [gameId, playerId, currentRoundId, word]
            );
          }
        }
      }

      await client.query('COMMIT');
      
      const updatedGame = await this.getGame(gameId);
      if (!updatedGame) {
        throw new Error(`Game ${gameId} not found after update`);
      }
      
      return updatedGame;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating game:', error);
      throw new Error(`Failed to update game: ${error}`);
    } finally {
      client.release();
    }
  }

  // Helper methods for complex operations
  async addRound(gameId: string, clearSubmissions: boolean = true): Promise<Round> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get next round number
      const roundCountQuery = `
        SELECT COALESCE(MAX(round_number), 0) + 1 as next_round
        FROM rounds 
        WHERE game_id = $1
      `;
      const roundCountResult = await client.query(roundCountQuery, [gameId]);
      const nextRoundNumber = roundCountResult.rows[0].next_round;

      // Create new round
      const roundQuery = `
        INSERT INTO rounds (game_id, round_number) 
        VALUES ($1, $2) 
        RETURNING id, created_at, updated_at
      `;
      const roundResult = await client.query(roundQuery, [gameId, nextRoundNumber]);
      const roundRow = roundResult.rows[0];

      // Clear player submissions for the new round if requested
      if (clearSubmissions) {
        await client.query(
          'DELETE FROM player_round_submissions WHERE game_id = $1',
          [gameId]
        );
      }

      await client.query('COMMIT');

      return {
        id: roundRow.id,
        words: [],
        createdAt: roundRow.created_at,
        updatedAt: roundRow.updated_at,
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding round:', error);
      throw new Error(`Failed to add round: ${error}`);
    } finally {
      client.release();
    }
  }

  async addWordToRound(roundId: string, word: Word): Promise<void> {
    try {
      const query = `
        INSERT INTO words (id, round_id, user_id, word, timestamp) 
        VALUES ($1, $2, $3, $4, $5)
      `;
      await this.pool.query(query, [
        word.id,
        roundId,
        word.playerId,
        word.word,
        word.timestamp
      ]);
    } catch (error) {
      console.error('Error adding word to round:', error);
      throw new Error(`Failed to add word to round: ${error}`);
    }
  }
}