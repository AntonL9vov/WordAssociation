import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock translations for testing
const resources = {
  en: {
    translation: {
      // Common
      'common.logout': 'Logout',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      
      // App
      'app.title': 'Multiplayer Word Game',
      'app.subtitle': 'Challenge friends with words',
      
      // Auth
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.name': 'Name',
      'auth.enterName': 'Enter your name',
      'auth.features.realtime': 'Real-time gameplay',
      'auth.features.wordFun': 'Word challenges',
      'auth.features.chat': 'Live chat',
      'auth.features.endless': 'Endless fun',
      
      // Game
      'game.gameRoom': 'Game Room',
      'game.gameId': 'Game ID',
      'game.leave': 'Leave Game',
      'game.gameSetup': 'Game Setup',
      'game.gameCompleted': 'Game Completed!',
      'game.restartGame': 'Restart Game',
      'game.matchFound': 'Match Found!',
      'game.gameRound': 'Game Round',
      'game.startGame.startWord': 'Start Word',
      'game.startGame.startWordPlaceholder': 'Enter starting word...',
      'game.startGame.randomWord': 'Random Word',
      'game.statuses.setup.label': 'Setup',
      'game.statuses.setup.description': 'Setting up game',
      'game.statuses.playing.label': 'Playing',
      'game.statuses.playing.description': 'Game in progress',
      'game.statuses.finished.label': 'Finished',
      'game.statuses.finished.description': 'Game completed',
      'game.statuses.unknown.label': 'Unknown',
      'game.statuses.unknown.description': 'Unknown status',
      
      // Messenger
      'messenger.typeMessage': 'Type your word...',
      'messenger.typeMessageDisabled': 'Waiting for others...',
      'messenger.placeholderDefault': 'Enter a word',
      'messenger.placeholderDisabled': 'Please wait...',
      'messenger.round': 'Round',
      'messenger.waitingForWords': 'waiting for words',
      'messenger.gameStarted': 'Game has started!',
      'messenger.noRoundsYet': 'No rounds yet',
      'messenger.submitFirstWord': 'Submit your first word',
      'messenger.roundsWillAppear': 'Rounds will appear here',
      'messenger.startWord': 'Starting word',
      'messenger.yourWord': 'Your Word',
      'messenger.otherPlayers': 'Other Players',
      'messenger.allPlayersChose': 'All players chose',
      'messenger.submitted': 'submitted',
      'messenger.addEmoji': 'Add emoji',
      
      // Pluralization
      'pluralization.players.one': 'player',
      'pluralization.players.few': 'players',
      'pluralization.players.many': 'players',
      'pluralization.words.one': 'word',
      'pluralization.words.few': 'words',
      'pluralization.words.many': 'words',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
