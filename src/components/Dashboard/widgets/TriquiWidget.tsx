import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Circle, RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameState = 'playing' | 'won' | 'draw' | 'notStarted';

export function TriquiWidget() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameState, setGameState] = useState<GameState>('notStarted');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameState('playing');
  };

  const handleClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    // Check for winner after player's move
    const winner = calculateWinner(newBoard);
    if (winner) {
      handleGameEnd(winner);
      return;
    }

    if (newBoard.every((cell) => cell !== null)) {
      handleGameEnd(null);
      return;
    }

    // Computer's turn
    setTimeout(() => {
      const computerMoveIndex = getComputerMove(newBoard);
      if (computerMoveIndex !== -1) {
        const updatedBoard = [...newBoard];
        updatedBoard[computerMoveIndex] = 'O';
        setBoard(updatedBoard);
        setIsXNext(true);

        // Check for winner after computer's move
        const winner = calculateWinner(updatedBoard);
        if (winner) {
          handleGameEnd(winner);
          return;
        }

        if (updatedBoard.every((cell) => cell !== null)) {
          handleGameEnd(null);
          return;
        }
      }
    }, 500);
  };

  const getComputerMove = (currentBoard: Board): number => {
    // Easy: Random move
    if (difficulty === 'easy') {
      const emptyCells = currentBoard
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCells.length === 0) return -1;
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Medium: 50% chance of optimal move, 50% chance of random
    if (difficulty === 'medium') {
      if (Math.random() > 0.5) {
        return findBestMove(currentBoard);
      } else {
        const emptyCells = currentBoard
          .map((cell, index) => (cell === null ? index : -1))
          .filter((index) => index !== -1);

        if (emptyCells.length === 0) return -1;
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    }

    // Hard: Always optimal move
    return findBestMove(currentBoard);
  };

  const findBestMove = (currentBoard: Board): number => {
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const newBoard = [...currentBoard];
        newBoard[i] = 'O';

        const score = minimax(newBoard, 0, false);

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const minimax = (currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    const winner = calculateWinner(currentBoard);

    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (currentBoard.every((cell) => cell !== null)) return 0;

    if (isMaximizing) {
      let bestScore = Number.NEGATIVE_INFINITY;

      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = 'O';

          const score = minimax(newBoard, depth + 1, false);
          bestScore = Math.max(score, bestScore);
        }
      }

      return bestScore;
    } else {
      let bestScore = Number.POSITIVE_INFINITY;

      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = 'X';

          const score = minimax(newBoard, depth + 1, true);
          bestScore = Math.min(score, bestScore);
        }
      }

      return bestScore;
    }
  };

  const calculateWinner = (currentBoard: Board): Player => {
    for (const [a, b, c] of winningCombinations) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const handleGameEnd = (winner: Player) => {
    if (winner === 'X') {
      setScores({ ...scores, X: scores.X + 1 });
      setGameState('won');
    } else if (winner === 'O') {
      setScores({ ...scores, O: scores.O + 1 });
      setGameState('won');
    } else {
      setScores({ ...scores, ties: scores.ties + 1 });
      setGameState('draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameState('playing');
  };

  const renderCell = (index: number) => {
    return (
      <motion.button
        whileHover={{ scale: board[index] ? 1 : 1.05 }}
        whileTap={{ scale: board[index] ? 1 : 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface border-2 border-text text-lg font-bold transition-all hover:border-text disabled:opacity-50 disabled:cursor-not-allowed md:h-14 md:w-14"
        onClick={() => handleClick(index)}
        disabled={board[index] !== null || gameState !== 'playing' || !isXNext}
      >
        {board[index] === 'X' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <X className="h-6 w-6 text-text md:h-7 md:w-7" strokeWidth={3} />
          </motion.div>
        )}
        {board[index] === 'O' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Circle className="h-5 w-5 text-text-muted md:h-6 md:w-6" strokeWidth={3} />
          </motion.div>
        )}
      </motion.button>
    );
  };

  const cardClass =
    'bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] h-full flex flex-col p-6 md:p-7';

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-text mb-4">Triqui</h3>

      {gameState === 'notStarted' && (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <p className="text-text-muted text-sm text-center mb-4">Elige la dificultad:</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                difficulty === 'easy'
                  ? 'bg-surface border-text text-text'
                  : 'bg-surface border-text/50 text-text-muted hover:border-text'
              }`}
            >
              Fácil
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                difficulty === 'medium'
                  ? 'bg-surface border-text text-text'
                  : 'bg-surface border-text/50 text-text-muted hover:border-text'
              }`}
            >
              Medio
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                difficulty === 'hard'
                  ? 'bg-surface border-text text-text'
                  : 'bg-surface border-text/50 text-text-muted hover:border-text'
              }`}
            >
              Difícil
            </button>
          </div>
          <button
            onClick={startGame}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text mt-4"
          >
            Iniciar juego
          </button>
        </div>
      )}

      {gameState !== 'notStarted' && (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-3 gap-2">
              {Array(9)
                .fill(null)
                .map((_, index) => (
                  <div key={index}>{renderCell(index)}</div>
                ))}
            </div>
          </div>

          <div className="flex justify-center space-x-6 text-center mb-4">
            <div>
              <p className="text-text-muted text-xs">Tú (X)</p>
              <p className="text-lg font-bold text-text">{scores.X}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Empates</p>
              <p className="text-lg font-bold text-text-muted">{scores.ties}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Yo (O)</p>
              <p className="text-lg font-bold text-text-muted">{scores.O}</p>
            </div>
          </div>

          {gameState === 'won' && (
            <p className="text-center text-sm text-text mb-3">
              {board.some((cell) => cell === 'X' && calculateWinner(board) === 'X')
                ? '¡Ganaste! 🎉'
                : 'Gané esta ronda 😊'}
            </p>
          )}

          {gameState === 'draw' && (
            <p className="text-center text-sm text-text mb-3">Empate 🤝</p>
          )}

          <div className="flex gap-2 mt-auto">
            <button
              onClick={resetGame}
              className="flex-1 px-4 py-2 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Jugar de nuevo
            </button>
            <button
              onClick={() => setGameState('notStarted')}
              className="px-4 py-2 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text"
            >
              Cambiar dificultad
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

