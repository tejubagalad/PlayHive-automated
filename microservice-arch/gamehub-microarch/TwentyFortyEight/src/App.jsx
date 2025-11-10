import React, { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const GRID_SIZE = 4;

const getEmptyGrid = () => Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

const getRandomEmptyCell = (grid) => {
  const emptyCells = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push({ i, j });
    });
  });
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const cloneGrid = (grid) => grid.map(row => [...row]);

const addNewTile = (grid) => {
  const newGrid = cloneGrid(grid);
  const pos = getRandomEmptyCell(newGrid);
  if (pos) newGrid[pos.i][pos.j] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const moveRowLeft = (row) => {
  const filtered = row.filter(n => n !== 0);
  const merged = [];
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }
  return [...merged, ...Array(row.length - merged.length).fill(0)];
};

const rotateGrid = (grid, clockwise = true) => {
  const newGrid = getEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (clockwise) newGrid[j][GRID_SIZE - 1 - i] = grid[i][j];
      else newGrid[GRID_SIZE - 1 - j][i] = grid[i][j];
    }
  }
  return newGrid;
};

const getTileColor = (value) => {
  const colors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return colors[value] || '#3c3a32';
};


function App() {
  const [grid, setGrid] = useState(addNewTile(addNewTile(getEmptyGrid())));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const move = (direction) => {
    let newGrid = cloneGrid(grid);
    let moved = false;

    const moveLeft = () => {
      for (let i = 0; i < GRID_SIZE; i++) {
        const newRow = moveRowLeft(newGrid[i]);
        if (newRow.join() !== newGrid[i].join()) moved = true;
        newGrid[i] = newRow;
      }
    };

    switch (direction) {
      case 'left':
        moveLeft();
        break;
      case 'right':
        newGrid = rotateGrid(newGrid, true);
        newGrid = rotateGrid(newGrid, true);
        moveLeft();
        newGrid = rotateGrid(newGrid, true);
        newGrid = rotateGrid(newGrid, true);
        break;
      case 'up':
        newGrid = rotateGrid(newGrid, false);
        moveLeft();
        newGrid = rotateGrid(newGrid, true);
        break;
      case 'down':
        newGrid = rotateGrid(newGrid, true);
        moveLeft();
        newGrid = rotateGrid(newGrid, false);
        break;
      default:
        break;
    }

    if (moved) {
      const withTile = addNewTile(newGrid);
      setGrid(withTile);
      updateScore(withTile);
      if (checkGameOver(withTile)) setGameOver(true);
    }
  };

  const updateScore = (newGrid) => {
    let total = 0;
    newGrid.forEach(row => row.forEach(val => total += val));
    setScore(total);
  };

  const checkGameOver = (grid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return false;
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return false;
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return false;
      }
    }
    return true;
  };

  const handleKeyDown = (e) => {
    if (gameOver) return;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) move('up');
    else if (['ArrowDown', 's', 'S'].includes(e.key)) move('down');
    else if (['ArrowLeft', 'a', 'A'].includes(e.key)) move('left');
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) move('right');
  };

  const resetGame = () => {
    const freshGrid = addNewTile(addNewTile(getEmptyGrid()));
    setGrid(freshGrid);
    setGameOver(false);
    setScore(0);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (gameOver) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) move('right');
        else move('left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) move('down');
        else move('up');
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#121212' }}>
      <div className="text-center">
        <h1 className="mb-4 text-white">2048 Game</h1>
        <div className="d-flex justify-content-center mb-3">
          <div className="badge bg-dark border border-secondary fs-5 px-4 py-2">
            <strong>Score:</strong> {score}
          </div>
        </div>
        <div
          className="game-board mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(60px, 80px))`,
            gridGap: '8px',
            backgroundColor: '#3a3a3c',
            padding: '10px',
            borderRadius: '10px',
            maxWidth: '360px',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {grid.flat().map((val, idx) => (
            <div
              key={idx}
              style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: val === 0 ? '#1c1c1e' : getTileColor(val),
                color: val > 4 ? '#f9f6f2' : '#776e65',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 'clamp(18px, 4vw, 24px)',
                borderRadius: '8px',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
              }}
            >
              {val !== 0 ? val : ''}
            </div>
          ))}
        </div>
        {gameOver && (
          <div className="mt-3 text-danger">
            <div><strong>Game Over!</strong></div>
            <button
              onClick={resetGame}
              className="btn btn-primary mt-2"
            >
              Restart Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
