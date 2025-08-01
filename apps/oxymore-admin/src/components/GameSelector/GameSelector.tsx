import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Gamepad2, Trophy, Users } from 'lucide-react';
import { useGameSelector } from '../../context/GameSelectorContext';
import TicTacToe from '../Games/TicTacToe/TicTacToe';
import Connect4 from '../Games/Connect4/Connect4';
import Battleship from '../Games/Battleship/Battleship';

interface Game {
  id: string;
  name: string;
  image: string;
  available: boolean;
  description: string;
  players: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: 'Stratégie' | 'Réflexion' | 'Action';
}

const games: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Tic_tac_toe.svg',
    available: true,
    description: 'Le classique jeu du morpion, simple mais stratégique. Alignez trois symboles pour gagner !',
    players: '2 Joueurs',
    difficulty: 'Facile',
    category: 'Stratégie'
  },
  {
    id: 'battleship',
    name: 'Bataille Navale',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Battleship_game_board.svg',
    available: true,
    description: 'Déployez votre flotte et trouvez les navires ennemis dans ce jeu de stratégie navale classique',
    players: '2 Joueurs',
    difficulty: 'Moyen',
    category: 'Stratégie'
  },
  {
    id: 'connect4',
    name: 'Puissance 4',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Connect4.PNG',
    available: true,
    description: 'Alignez quatre jetons de votre couleur horizontalement, verticalement ou en diagonale',
    players: '2 Joueurs',
    difficulty: 'Moyen',
    category: 'Réflexion'
  }
];

const GameSelector = () => {
  const { isOpen, closeGameSelector } = useGameSelector();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const handleGameSelect = (game: Game) => {
    if (!game.available) return;
    setSelectedGame(game.id);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const getCategoryIcon = (category: Game['category']) => {
    switch (category) {
      case 'Stratégie':
        return <Trophy className="w-5 h-5" />;
      case 'Réflexion':
        return <Users className="w-5 h-5" />;
      case 'Action':
        return <Gamepad2 className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {selectedGame ? (
            <>
              {selectedGame === 'tictactoe' && <TicTacToe onClose={handleCloseGame} />}
              {selectedGame === 'battleship' && <Battleship onClose={handleCloseGame} />}
              {selectedGame === 'connect4' && <Connect4 onClose={handleCloseGame} />}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-[30px] overflow-y-auto"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]" />

              <div className="relative min-h-screen flex flex-col items-center justify-start p-8 pt-24">
                {/* Header avec animation */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6">
                    Arcade Zone
                  </h2>
                  <p className="text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Plongez dans notre collection de jeux classiques revisités pour des moments de compétition intense !
                  </p>
                </motion.div>

                {/* Grille de jeux avec hover effects avancés */}
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {games.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onHoverStart={() => setHoveredGame(game.id)}
                      onHoverEnd={() => setHoveredGame(null)}
                      onClick={() => handleGameSelect(game)}
                      className={`relative group rounded-2xl overflow-hidden transition-all duration-500
                        ${game.available
                          ? 'cursor-pointer hover:shadow-[0_0_50px_rgba(120,0,255,0.3)]'
                          : 'cursor-not-allowed opacity-50'}`}
                    >
                      {/* Background avec effet de zoom */}
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <motion.div
                          animate={{
                            scale: hoveredGame === game.id ? 1.1 : 1
                          }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </div>

                      {/* Contenu avec animation */}
                      <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                        <motion.div
                          initial={false}
                          animate={{
                            y: hoveredGame === game.id ? 0 : 20,
                            opacity: hoveredGame === game.id ? 1 : 0.8
                          }}
                        >
                          {/* Tags */}
                          <div className="flex gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium text-white flex items-center gap-2">
                              {getCategoryIcon(game.category)}
                              {game.category}
                            </span>
                          </div>

                          {/* Titre et description */}
                          <h3 className="text-3xl font-bold text-white mb-2">{game.name}</h3>
                          <p className="text-white/70 line-clamp-2">{game.description}</p>

                          {/* Info joueurs */}
                          <div className="mt-4 flex items-center gap-2 text-white/60">
                            <Users className="w-4 h-4" />
                            <span>{game.players}</span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Badge "Bientôt" pour les jeux non disponibles */}
                      {!game.available && (
                        <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm
                          flex items-center gap-2 text-white/70 z-20">
                          <Lock className="w-4 h-4" />
                          <span>Bientôt</span>
                        </div>
                      )}

                      {/* Overlay au hover */}
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: hoveredGame === game.id ? 1 : 0
                        }}
                        className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Bouton de fermeture avec animation */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={closeGameSelector}
                  className="fixed top-8 right-8 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20
                    flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default GameSelector;
