import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { useGameSelector } from '../../context/GameSelectorContext';
import TicTacToe from '../Games/TicTacToe/TicTacToe';
import Connect4 from '../Games/Connect4/Connect4';

interface Game {
  id: string;
  name: string;
  image: string;
  available: boolean;
  description: string;
}

const games: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    image: '/games/tictactoe.jpg',
    available: true,
    description: 'Le classique jeu du morpion, simple mais stratégique'
  },
  {
    id: 'connect4',
    name: 'Puissance 4',
    image: '/games/connect4.jpg',
    available: true,
    description: 'Alignez 4 jetons pour gagner'
  },
  {
    id: 'battleship',
    name: 'Bataille Navale',
    image: '/games/battleship.jpg',
    available: false,
    description: 'Trouvez et coulez les navires ennemis (Bientôt disponible)'
  }
];

const GameSelector = () => {
  const { isOpen, closeGameSelector } = useGameSelector();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (game: Game) => {
    if (!game.available) return;
    setSelectedGame(game.id);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {selectedGame === 'tictactoe' ? (
            <TicTacToe onClose={handleCloseGame} />
          ) : selectedGame === 'connect4' ? (
            <Connect4 onClose={handleCloseGame} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-[30px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]" />
              <div className="absolute inset-0 bg-[url('/effects/noise.png')] opacity-[0.02] mix-blend-overlay" />
              
              <div className="relative h-full flex flex-col items-center justify-center p-8">
                {/* Titre */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-5xl font-bold text-white mb-4">Mini-jeux</h2>
                  <p className="text-xl text-white/60">Sélectionnez un jeu pour commencer</p>
                </motion.div>

                {/* Grille de jeux */}
                <div className="w-full max-w-5xl mx-auto grid grid-cols-3 gap-8">
                  {games.map((game) => (
                    <motion.div
                      key={game.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={game.available ? { scale: 1.05 } : {}}
                      onClick={() => handleGameSelect(game)}
                      className={`relative group rounded-2xl overflow-hidden transition-all
                        ${game.available 
                          ? 'cursor-pointer hover:shadow-[0_0_50px_rgba(120,0,255,0.3)]' 
                          : 'cursor-not-allowed opacity-50'}`}
                    >
                      {/* Image du jeu */}
                      <div className="aspect-video relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informations */}
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                        <p className="text-white/70">{game.description}</p>
                      </div>

                      {/* Badge de statut */}
                      {!game.available && (
                        <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm
                          flex items-center gap-2 text-white/70">
                          <Lock className="w-4 h-4" />
                          <span>Bientôt</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bouton de fermeture */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={closeGameSelector}
                  className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 
                    flex items-center justify-center transition-colors"
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