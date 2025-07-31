import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle, Trophy, RotateCcw } from 'lucide-react';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
  [0, 4, 8], [2, 4, 6]             // Diagonales
];

interface TicTacToeProps {
  onClose: () => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onClose }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (boardState: Board): { winner: Player | 'draw' | null; line: number[] | null } => {
    // Vérifier les combinaisons gagnantes
    for (const line of winningCombinations) {
      const [a, b, c] = line;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { winner: boardState[a] as Player, line };
      }
    }

    // Vérifier match nul
    if (boardState.every(cell => cell !== null)) {
      return { winner: 'draw', line: null };
    }

    return { winner: null, line: null };
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: newWinner, line } = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setWinningLine(line);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-[30px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]" />
      
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Tic Tac Toe</h2>
          {!winner && (
            <p className="text-xl text-white/60">
              Au tour de : {currentPlayer === 'X' ? (
                <X className="inline-block w-6 h-6 text-blue-500" />
              ) : (
                <Circle className="inline-block w-6 h-6 text-red-500" />
              )}
            </p>
          )}
        </div>

        {/* Plateau de jeu */}
        <div className="grid grid-cols-3 gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              whileHover={!cell && !winner ? { scale: 0.95 } : {}}
              onClick={() => handleCellClick(index)}
              className={`w-24 h-24 rounded-xl flex items-center justify-center
                ${!cell && !winner ? 'hover:bg-white/10' : ''} 
                ${winningLine?.includes(index) ? 'bg-white/20' : 'bg-white/5'}
                transition-colors`}
            >
              {cell && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12"
                >
                  {cell === 'X' ? (
                    <X className="w-full h-full text-blue-500" />
                  ) : (
                    <Circle className="w-full h-full text-red-500" />
                  )}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Message de fin */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 text-center"
            >
              {winner === 'draw' ? (
                <p className="text-2xl text-white/60">Match nul !</p>
              ) : (
                <div className="flex items-center gap-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <p className="text-2xl text-white">
                    {winner === 'X' ? (
                      <X className="inline-block w-8 h-8 text-blue-500" />
                    ) : (
                      <Circle className="inline-block w-8 h-8 text-red-500" />
                    )} gagne !
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boutons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white 
              flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Recommencer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white 
              flex items-center gap-2 transition-colors"
          >
            <X className="w-5 h-5" />
            Quitter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TicTacToe; 