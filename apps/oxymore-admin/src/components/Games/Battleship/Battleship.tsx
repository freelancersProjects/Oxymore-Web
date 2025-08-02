import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Target, Waves } from 'lucide-react';

interface BattleshipProps {
  onClose: () => void;
}

interface Cell {
  isShip: boolean;
  isHit: boolean;
  isRevealed: boolean;
}

interface Board extends Array<Array<Cell>> {}

interface ShipPlacement {
  x: number;
  y: number;
  length: number;
  isVertical: boolean;
}

const BOARD_SIZE = 10;
const SHIPS = [
  { name: 'Porte-avions', length: 5, image: 'https://i.imgur.com/XhOqxVe.png' },
  { name: 'Croiseur', length: 4, image: 'https://i.imgur.com/QYuKGVj.png' },
  { name: 'Contre-torpilleur', length: 3, image: 'https://i.imgur.com/8FrGyJJ.png' },
  { name: 'Sous-marin', length: 3, image: 'https://i.imgur.com/YyPNBtK.png' },
  { name: 'Torpilleur', length: 2, image: 'https://i.imgur.com/2qWSHHX.png' }
];

const createEmptyBoard = (): Board =>
  Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill(null).map(() => ({
      isShip: false,
      isHit: false,
      isRevealed: false
    }))
  );

const placeShip = (board: Board, ship: ShipPlacement): Board => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { x, y, length, isVertical } = ship;

  for (let i = 0; i < length; i++) {
    if (isVertical) {
      newBoard[y + i][x].isShip = true;
    } else {
      newBoard[y][x + i].isShip = true;
    }
  }

  return newBoard;
};

const canPlaceShip = (board: Board, ship: ShipPlacement): boolean => {
  const { x, y, length, isVertical } = ship;

  // Vérifier les limites du plateau
  if (isVertical && y + length > BOARD_SIZE) return false;
  if (!isVertical && x + length > BOARD_SIZE) return false;

  // Vérifier les collisions avec d'autres navires
  for (let i = -1; i <= length; i++) {
    for (let j = -1; j <= 1; j++) {
      const checkY = y + (isVertical ? i : j);
      const checkX = x + (isVertical ? j : i);

      if (
        checkY >= 0 && checkY < BOARD_SIZE &&
        checkX >= 0 && checkX < BOARD_SIZE &&
        board[checkY][checkX].isShip
      ) {
        return false;
      }
    }
  }

  return true;
};

const generateRandomBoard = (): Board => {
  let board = createEmptyBoard();

  for (const ship of SHIPS) {
    let placed = false;
    while (!placed) {
      const isVertical = Math.random() < 0.5;
      const x = Math.floor(Math.random() * (BOARD_SIZE - (isVertical ? 1 : ship.length)));
      const y = Math.floor(Math.random() * (BOARD_SIZE - (isVertical ? ship.length : 1)));

      const placement = { x, y, length: ship.length, isVertical };
      if (canPlaceShip(board, placement)) {
        board = placeShip(board, placement);
        placed = true;
      }
    }
  }

  return board;
};

const Battleship: React.FC<BattleshipProps> = ({ onClose }) => {
  const [board, setBoard] = useState<Board>(generateRandomBoard());
  const [shots, setShots] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  const totalShipCells = SHIPS.reduce((acc, ship) => acc + ship.length, 0);

  const handleCellClick = (x: number, y: number) => {
    if (gameOver || board[y][x].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[y][x].isRevealed = true;
    newBoard[y][x].isHit = newBoard[y][x].isShip;

    setBoard(newBoard);
    setShots(prev => prev + 1);
    if (newBoard[y][x].isShip) {
      setHits(prev => {
        const newHits = prev + 1;
        if (newHits === totalShipCells) {
          setGameOver(true);
        }
        return newHits;
      });
    }
  };

  const resetGame = () => {
    setBoard(generateRandomBoard());
    setShots(0);
    setHits(0);
    setGameOver(false);
    setHoveredCell(null);
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
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Bataille Navale</h2>
          <div className="flex items-center justify-center gap-8 text-[var(--text-secondary)]">
            <p className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Tirs : {shots}
            </p>
            <p className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-red-500" />
              Touches : {hits}
            </p>
          </div>
        </div>

        {/* Board */}
        <div className="bg-[var(--card-background)] p-6 rounded-2xl shadow-xl border border-[var(--border-color)]">
          <div className="grid grid-cols-10 gap-1">
            {board.map((row, y) => (
              row.map((cell, x) => (
                <motion.button
                  key={`${x}-${y}`}
                  className={`w-12 h-12 rounded-lg relative overflow-hidden
                    ${cell.isRevealed
                      ? cell.isHit
                        ? 'bg-red-500/20'
                        : 'bg-blue-500/20'
                      : 'bg-[var(--overlay-hover)] hover:bg-[var(--overlay-active)]'
                    } transition-colors`}
                  onClick={() => handleCellClick(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  disabled={cell.isRevealed || gameOver}
                >
                  {cell.isRevealed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {cell.isHit ? (
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                      ) : (
                        <Waves className="w-5 h-5 text-blue-500" />
                      )}
                    </motion.div>
                  )}
                  {hoveredCell?.x === x && hoveredCell?.y === y && !cell.isRevealed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Target className="w-5 h-5 text-[var(--text-secondary)]" />
                    </motion.div>
                  )}
                </motion.button>
              ))
            ))}
          </div>
        </div>

        {/* Ships */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {SHIPS.map((ship, index) => (
            <div
              key={index}
              className="bg-[var(--card-background)] p-4 rounded-xl border border-[var(--border-color)]"
            >
              <img
                src={ship.image}
                alt={ship.name}
                className="w-24 h-12 object-contain mb-2"
              />
              <p className="text-sm text-center text-[var(--text-secondary)]">{ship.name}</p>
            </div>
          ))}
        </div>

        {/* Game Over Message */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center gap-4 justify-center">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <p className="text-2xl text-[var(--text-primary)]">
                  Victoire ! {shots} tirs pour gagner
                </p>
              </div>
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

export default Battleship;
