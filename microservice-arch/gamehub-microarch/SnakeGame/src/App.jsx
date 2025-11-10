import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// 🟩 Reduced for better visibility across screens
const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 18;
const CELL_SIZE = 14;

const INITIAL_SNAKE = [
  { x: 5, y: 9 },
  { x: 4, y: 9 },
  { x: 3, y: 9 },
];

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function getRandomFoodPosition(snakeBody) {
  let newPos;
  while (true) {
    newPos = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
    if (!snakeBody.some((seg) => seg.x === newPos.x && seg.y === newPos.y)) break;
  }
  return newPos;
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [food, setFood] = useState(getRandomFoodPosition(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(150);

  const directionRef = useRef(direction);
  directionRef.current = direction;
  const touchStartRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => moveSnake(), speed);
    return () => clearInterval(interval);
  }, [snake, gameOver, speed, gameStarted]);

  // === Keyboard Controls ===
  function handleKeyDown(e) {
    const key = e.key;
    const newDirection = DIRECTIONS[key];
    if (newDirection) {
      const oppositeX = directionRef.current.x + newDirection.x === 0;
      const oppositeY = directionRef.current.y + newDirection.y === 0;
      if (!(oppositeX && oppositeY)) setDirection(newDirection);
    }
  }

  // === Touch Controls ===
  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const THRESHOLD = 20;

    if (Math.max(absX, absY) < THRESHOLD) return;

    if (absX > absY) {
      if (dx > 0 && directionRef.current !== DIRECTIONS.ArrowLeft)
        setDirection(DIRECTIONS.ArrowRight);
      else if (dx < 0 && directionRef.current !== DIRECTIONS.ArrowRight)
        setDirection(DIRECTIONS.ArrowLeft);
    } else {
      if (dy > 0 && directionRef.current !== DIRECTIONS.ArrowUp)
        setDirection(DIRECTIONS.ArrowDown);
      else if (dy < 0 && directionRef.current !== DIRECTIONS.ArrowDown)
        setDirection(DIRECTIONS.ArrowUp);
    }

    touchStartRef.current = null;
  }

  // === Snake Movement ===
  function moveSnake() {
    const head = snake[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y,
    };

    if (
      newHead.x < 0 ||
      newHead.x >= BOARD_WIDTH ||
      newHead.y < 0 ||
      newHead.y >= BOARD_HEIGHT
    ) {
      return onGameOver();
    }

    if (snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      return onGameOver();
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 1);
      setFood(getRandomFoodPosition(newSnake));
      setSpeed((prev) => (prev > 70 ? prev - 5 : prev));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  function onGameOver() {
    setGameOver(true);
  }

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTIONS.ArrowRight);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
    setScore(0);
    setSpeed(150);
    setGameOver(false);
    setGameStarted(true);
  }

  // === Render ===
  const cells = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let bgColor = "#1e1e1e";
      if (snake.some((seg) => seg.x === x && seg.y === y)) bgColor = "#00ff88";
      else if (food.x === x && food.y === y) bgColor = "#ff4d4d";

      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            backgroundColor: bgColor,
          }}
        ></div>
      );
    }
  }

  return (
    <div className="game-container">
      <h1 className="game-title">🐍 Snake Game</h1>

      {!gameStarted ? (
        <button onClick={() => setGameStarted(true)} className="start-button">
          Start Game
        </button>
      ) : (
        <>
          <div
            className="game-grid"
            style={{
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
            }}
          >
            {cells}
          </div>

          <div className="score-display">
            <strong>Score:</strong> {score}
          </div>

          {gameOver && (
            <div className="game-over">
              <strong>💥 Game Over!</strong>
              <button onClick={resetGame} className="restart-button">
                Restart
              </button>
            </div>
          )}
        </>
      )}

      <p className="controls-info">🎮 Use Arrow Keys or Swipe on Mobile</p>
    </div>
  );
}

export default App;
