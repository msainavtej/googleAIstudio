import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';

const GRID_SIZE = 20;

type Point = {
  x: number;
  y: number;
};

type Direction = {
  x: number;
  y: number;
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = DIRECTIONS.UP;

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(150);

  // Direction queue to prevent rapid double-turns causing self-collision
  const [directionQueue, setDirectionQueue] = useState<Direction[]>([]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (collision);
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setDirectionQueue([]);
    setScore(0);
    setSpeed(150);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) {
      if (e.key === 'Enter') resetGame();
      return;
    }
    if (e.key === ' ') {
      setIsPaused(p => !p);
      e.preventDefault();
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault(); // prevent scrolling
    }

    setDirectionQueue((queue) => {
      // Use the last direction in the queue, or the current direction if queue is empty
      const lastDir = queue.length > 0 ? queue[queue.length - 1] : direction;
      let newDir: Direction | null = null;
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (lastDir !== DIRECTIONS.DOWN && lastDir !== DIRECTIONS.UP) newDir = DIRECTIONS.UP;
          break;
        case 'arrowdown':
        case 's':
          if (lastDir !== DIRECTIONS.UP && lastDir !== DIRECTIONS.DOWN) newDir = DIRECTIONS.DOWN;
          break;
        case 'arrowleft':
        case 'a':
          if (lastDir !== DIRECTIONS.RIGHT && lastDir !== DIRECTIONS.LEFT) newDir = DIRECTIONS.LEFT;
          break;
        case 'arrowright':
        case 'd':
          if (lastDir !== DIRECTIONS.LEFT && lastDir !== DIRECTIONS.RIGHT) newDir = DIRECTIONS.RIGHT;
          break;
      }

      if (newDir) {
        // Keep queue small to prevent massive buffering
        return queue.length < 3 ? [...queue, newDir] : queue;
      }
      return queue;
    });
  }, [direction, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameTick = () => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      let currentDir = direction;
      
      // Dequeue next direction
      setDirectionQueue((queue) => {
        if (queue.length > 0) {
          currentDir = queue[0];
          setDirection(queue[0]);
          return queue.slice(1);
        }
        return queue;
      });

      const head = prevSnake[0];
      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        // Increase speed slightly
        setSpeed((s) => Math.max(50, s - 2)); 
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  };

  useInterval(gameTick, gameOver || isPaused ? null : speed);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 neon-box-cyan border border-cyan-500/30 flex flex-col items-center">
        
        {/* Header / Score */}
        <div className="w-full flex justify-between items-end mb-6 font-mono">
          <div>
            <p className="text-cyan-500/80 text-sm uppercase tracking-widest">Score</p>
            <p className="text-4xl font-bold neon-text-cyan">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-cyan-500/80 text-sm uppercase tracking-widest">Status</p>
            <p className="text-lg font-bold text-cyan-300">
              {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
            </p>
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="relative bg-black/60 border-2 border-cyan-500/50 rounded-md overflow-hidden"
          style={{ width: 400, height: 400 }}
        >
          {/* Grid lines (optional, adds to aesthetic) */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ 
              backgroundImage: 'linear-gradient(theme(colors.cyan.500) 1px, transparent 1px), linear-gradient(90deg, theme(colors.cyan.500) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm ${isHead ? 'bg-cyan-300 shadow-[0_0_10px_theme(colors.cyan.300)]' : 'bg-cyan-500 shadow-[0_0_5px_theme(colors.cyan.500)]'}`}
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  transform: 'scale(0.95)', // add slight gap between segments
                }}
              />
            );
          })}

          {/* Food */}
          <div
            className="absolute bg-fuchsia-500 rounded-full animate-pulse shadow-[0_0_15px_theme(colors.fuchsia.500)]"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              transform: 'scale(0.8)',
            }}
          />

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
              <h2 className="text-3xl font-bold neon-text-fuchsia mb-4 font-display text-center">SYSTEM FAILURE</h2>
              <p className="text-cyan-300 font-mono mb-6">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_15px_theme(colors.cyan.600)] transition hover:scale-105 font-mono"
              >
                [ RESTART ]
              </button>
            </div>
          )}
        </div>
        
        {/* Controls Hint */}
        <div className="mt-6 text-center font-mono text-cyan-500/60 text-xs">
          USE [W][A][S][D] OR [ARROWS] TO MOVE &bull; [SPACE] TO PAUSE
        </div>
      </div>
    </div>
  );
}
