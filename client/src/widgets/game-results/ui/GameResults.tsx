import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/shared/stores/game-store";
import { useAuth } from "@/shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { disconnectPlayer } from "../api/http";

export const GameResults = () => {
  const navigate = useNavigate();
  const game = useGameStore((s) => s.game);
  const setGame = useGameStore((s) => s.setGame);
  const { user } = useAuth();
  const [shareMessage, setShareMessage] = useState("");

  const gameStats = useMemo(() => {
    if (!game) return null;

    const allWords = game.rounds.flatMap(round => round.words);
    const playerStats = game.players.map(player => {
      const playerWords = allWords.filter(word => word.playerId === player.id);
      return {
        player,
        wordsCount: playerWords.length,
        words: playerWords.map(w => w.word),
      };
    });

    // Sort by words count to determine winner
    const sortedStats = [...playerStats].sort((a, b) => b.wordsCount - a.wordsCount);
    const winner = sortedStats[0];
    const isCurrentUserWinner = winner?.player.id === user?.id;

    return {
      playerStats: sortedStats,
      winner,
      isCurrentUserWinner,
      totalRounds: game.rounds.length,
      totalWords: allWords.length,
      startWord: game.startWord,
    };
  }, [game, user]);

  useEffect(() => {
    if (gameStats?.isCurrentUserWinner) {
      setShareMessage(`🎉 Я победил в игре слов! Набрал ${gameStats.winner.wordsCount} слов!`);
    } else {
      setShareMessage(`🎮 Сыграл в интересную игру слов! Всего было ${gameStats?.totalWords} слов.`);
    }
  }, [gameStats]);

  if (!game || !gameStats) return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Игра слов завершена!',
          text: shareMessage,
        });
      } else {
        await navigator.clipboard.writeText(shareMessage);
        // Could add a toast notification here
      }
    } catch (error) {
      // Silently handle share cancellation
    }
  };

  const handleGoHome = () => {
    if (!user) return;
    disconnectPlayer(game.id, user.id, setGame);
    navigate("/");
  };

  const handlePlayAgain = () => {
    // This would need API implementation to create a new game
    // For now, just navigate home
    handleGoHome();
  };

  return (
    <div className="game-results animate-scale-in">
      <div className="results-header">
        <div className="trophy-section">
          <div className={`trophy-icon ${gameStats.isCurrentUserWinner ? 'winner' : ''}`}>
            {gameStats.isCurrentUserWinner ? '🏆' : '🎮'}
          </div>
          <h2 className="results-title">
            {gameStats.isCurrentUserWinner ? '🎉 Поздравляем!' : 'Игра завершена'}
          </h2>
          <p className="results-subtitle">
            {gameStats.isCurrentUserWinner 
              ? 'Вы победили в этой игре!' 
              : 'Спасибо за участие в игре!'}
          </p>
        </div>
      </div>

      <div className="winner-card">
        <div className="winner-info">
          <div className="winner-avatar">
            {gameStats.winner.player.name[0].toUpperCase()}
          </div>
          <div className="winner-details">
            <h3>Победитель: {gameStats.winner.player.name}</h3>
            <p>{gameStats.winner.wordsCount} слов</p>
          </div>
        </div>
      </div>

      <div className="game-stats-card">
        <h3 className="section-title">Статистика игры</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Стартовое слово:</span>
            <span className="stat-value">{gameStats.startWord}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Раундов:</span>
            <span className="stat-value">{gameStats.totalRounds}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Всего слов:</span>
            <span className="stat-value">{gameStats.totalWords}</span>
          </div>
        </div>
      </div>

      <div className="players-results-card">
        <h3 className="section-title">Результаты игроков</h3>
        
        <div className="players-list">
          {gameStats.playerStats.map((stat, index) => (
            <div 
              key={stat.player.id} 
              className={`player-result-item ${stat.player.id === user?.id ? 'current-user' : ''} ${index === 0 ? 'winner' : ''}`}
            >
              <div className="player-rank">
                <span className="rank-number">#{index + 1}</span>
                {index === 0 && <span className="trophy-mini">🏆</span>}
              </div>
              
              <div className="player-avatar">
                {stat.player.name[0].toUpperCase()}
              </div>
              
              <div className="player-info">
                <div className="player-name">
                  {stat.player.name}
                  {stat.player.id === user?.id && <span className="you-badge">Вы</span>}
                </div>
                <div className="player-score">
                  {stat.wordsCount} слов
                </div>
              </div>
              
              <div className="player-stats">
                <div className="score-number">{stat.wordsCount}</div>
                {stat.words.length > 0 && (
                  <div className="last-word">
                    Последнее: {stat.words[stat.words.length - 1]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button
          onClick={handleGoHome}
          className="btn-modern gradient-primary home-button"
        >
          🏠 На главную
        </button>
        
        <button
          onClick={handlePlayAgain}
          className="btn-modern play-again-button"
        >
          🔄 Играть ещё
        </button>
        
        <button
          onClick={handleShare}
          className="btn-modern share-button"
          title="Поделиться результатом"
        >
          📤 Поделиться
        </button>
      </div>

      <div className="thanks-message">
        <p>Спасибо за игру! 🎮</p>
      </div>
    </div>
  );
};