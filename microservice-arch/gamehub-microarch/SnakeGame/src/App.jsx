import React, { useEffect, useState } from "react";
import { bindUniversalControls } from "./universalControls";
import "./index.css";

const GRID_SIZE = 20;

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");

  // === Movement handler ===
  const moveSnake = () => {
    setSnake((prev) => {
      const newSnake = [...prev];
      const head = { ...newSnake[0] };

      if (direction === "UP") head.y -= 1;
      else if (direction === "DOWN") head.y += 1;
      else if (direction === "LEFT") head.x -= 1;
      else if (direction === "RIGHT") head.x += 1;

      newSnake.unshift(head);

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      // Check wall or self collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake
          .slice(1)
          .some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        alert("Game Over!");
        window.location.reload();
      }

      return newSnake;
    });
  };

  // === Auto move every 150ms ===
  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, snake]);

  // === Keyboard + Touch Controls ===
  useEffect(() => {
    const unbind = bindUniversalControls({
      onMoveUp: () => setDirection("UP"),
      onMoveDown: () => setDirection("DOWN"),
      onMoveLeft: () => setDirection("LEFT"),
      onMoveRight: () => setDirection("RIGHT"),
    });
    return () => unbind();
  }, []);

  // === Render ===
  return (
    <div className="game-container">
      <h1 className="game-title">🐍 Snake Game</h1>
      <div className="game-grid">
        {[...Array(GRID_SIZE)].map((_, row) => (
          <div key={row} className="row">
            {[...Array(GRID_SIZE)].map((_, col) => {
              const isSnake = snake.some((s) => s.x === col && s.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={col}
                  className={`cell ${
                    isSnake ? "snake" : isFood ? "food" : ""
                  }`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="controls-info">Use Arrow Keys or Swipe on Mobile</p>
    </div>
  );
};

export default App;
