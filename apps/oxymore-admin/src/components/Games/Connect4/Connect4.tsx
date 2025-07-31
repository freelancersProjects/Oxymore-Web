import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy } from 'lucide-react';

interface Connect4Props {
  onClose: () => void;
}

type Player = 1 | 2;
type Cell = Player | null;
type Board = Cell[][];

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = (): Board => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

const Connect4: React.FC<Connect4Props> = ({ onClose }) => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const checkWinner = (board: Board, row: number, col: number, player: Player): [number, number][] | null => {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal ↘
      [1, -1],  // Diagonal ↙
    ];

    for (const [dy, dx] of directions) {
      const cells: [number, number][] = [];
      
      // Check both directions
      for (let i = -3; i <= 3; i++) {
        const newRow = row + dy * i;
        const newCol = col + dx * i;
        
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          cells.push([newRow, newCol]);
          if (cells.length === 4) return cells;
        } else {
          cells.length = 0;
        }
      }
    }

    return null;
  };

  const checkDraw = (board: Board): boolean => {
    return board[0].every(cell => cell !== null);
  };

  const getLowestEmptyRow = (col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  const handleColumnClick = (col: number) => {
    if (winner || board[0][col] !== null) return;

    const row = getLowestEmptyRow(col);
    if (row === -1) return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const winningLine = checkWinner(newBoard, row, col, currentPlayer);
    if (winningLine) {
      setWinner(currentPlayer);
      setWinningCells(winningLine);
    } else if (checkDraw(newBoard)) {
      setWinner('draw');
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setHoveredColumn(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-[30px] dark:bg-black/95 light:bg-white/95"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]" />
      
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Puissance 4</h2>
          {!winner && (
            <p className="text-xl text-[var(--text-secondary)]">
              Au tour du joueur {currentPlayer === 1 ? (
                <span className="text-blue-500 font-bold">●</span>
              ) : (
                <span className="text-red-500 font-bold">●</span>
              )}
            </p>
          )}
        </div>

        {/* Board */}
        <div className="bg-[var(--card-background)] p-4 rounded-2xl shadow-xl border border-[var(--border-color)]">
          <div className="grid grid-cols-7 gap-2 relative">
            {/* Column click zones */}
            {Array(COLS).fill(null).map((_, col) => (
              <div
                key={`col-${col}`}
                className="absolute top-0 bottom-0"
                style={{ 
                  left: `calc(${col * (100 / 7)}%)`,
                  width: `calc(${100 / 7}%)`,
                  pointerEvents: winner || board[0][col] !== null ? 'none' : 'auto'
                }}
                onClick={() => handleColumnClick(col)}
                onMouseEnter={() => setHoveredColumn(col)}
                onMouseLeave={() => setHoveredColumn(null)}
              />
            ))}

            {/* Board cells */}
            {board.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-16 h-16 rounded-full flex items-center justify-center relative shadow-inner
                      ${winningCells.some(([r, c]) => r === rowIndex && c === colIndex) 
                        ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-[var(--card-background)]' 
                        : ''}`}
                    style={{
                      background: cell === null 
                        ? 'var(--overlay-hover)' 
                        : cell === 1 
                        ? 'rgb(59, 130, 246)' 
                        : 'rgb(239, 68, 68)',
                      pointerEvents: 'none'
                    }}
                  >
                    {/* Preview piece */}
                    {rowIndex === 0 && hoveredColumn === colIndex && !winner && !cell && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.5 }}
                        className="absolute top-0 left-0 w-full h-full rounded-full"
                        style={{
                          background: currentPlayer === 1 
                            ? 'rgb(59, 130, 246)' 
                            : 'rgb(239, 68, 68)'
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Winner message */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 text-center"
            >
              {winner === 'draw' ? (
                <p className="text-2xl text-[var(--text-secondary)]">Match nul !</p>
              ) : (
                <div className="flex items-center gap-4 justify-center">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <p className="text-2xl text-[var(--text-primary)]">
                    Joueur <span className={winner === 1 ? 'text-blue-500 font-bold' : 'text-red-500 font-bold'}>
                      {winner === 1 ? '●' : '●'}
                    </span> gagne !
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 rounded-xl bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] 
              text-[var(--text-primary)] flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Recommencer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)] 
              text-[var(--text-primary)] flex items-center gap-2 transition-colors"
          >
            <X className="w-5 h-5" />
            Quitter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Connect4; 