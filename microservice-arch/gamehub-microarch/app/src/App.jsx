import React from 'react';
import './App.css';

const App = () => {
  const redirectToGame = (game) => {
    // 🌐 Always use same origin (works locally and in Azure)
    const baseUrl = window.location.origin;

    // 🧭 Match your ingress subpaths
    const gameUrls = {
      '2048': `${baseUrl}/2048/`,
      'snake': `${baseUrl}/snake/`,
    };

    const card = document.querySelector(`.game-card-${game}`);
    if (card) card.classList.add('loading');

    // ⏳ Add slight delay for animation
    setTimeout(() => {
      window.location.href = gameUrls[game];
    }, 400);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="title">🎮 GameHub</h1>
        <p className="subtitle">Choose your next challenge</p>

        <div className="games-grid">
          <div
            className="game-card game-card-2048"
            onClick={() => redirectToGame('2048')}
            role="button"
            tabIndex={0}
            aria-label="Play 2048 game"
            onKeyDown={(e) => e.key === 'Enter' && redirectToGame('2048')}
          >
            <div className="card-glow"></div>
            <span className="game-icon">🧩</span>
            <h2 className="game-title">2048</h2>
            <p className="game-description">
              Merge tiles and reach the magic 2048 in this addictive puzzle!
            </p>
          </div>

          <div
            className="game-card game-card-snake"
            onClick={() => redirectToGame('snake')}
            role="button"
            tabIndex={0}
            aria-label="Play Snake game"
            onKeyDown={(e) => e.key === 'Enter' && redirectToGame('snake')}
          >
            <div className="card-glow"></div>
            <span className="game-icon">🐍</span>
            <h2 className="game-title">Snake</h2>
            <p className="game-description">
              Guide your snake to grow longer — without biting yourself!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
