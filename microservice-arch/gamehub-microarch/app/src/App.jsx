import React from 'react';
import './App.css'; // Import the updated CSS file

const App = () => {
  const redirectToGame = (game) => {
    const gameUrls = {
      '2048': 'http://2048.gamehub.local',
      'snake': 'http://snake.gamehub.local'
    };
    // Simulate a brief loading state for better UX
    const card = document.querySelector(`.game-card-${game}`);
    if (card) {
      card.style.pointerEvents = 'none'; // Disable clicks during redirect
      card.style.opacity = '0.7';
    }
    setTimeout(() => {
      window.location.href = gameUrls[game];
    }, 300); // Short delay for visual feedback
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="title">Game Hub</h1>
        <p className="subtitle">Choose your adventure</p>
        
        <div className="games-grid" role="grid" aria-label="Game selection grid">
          <div 
            className="game-card game-card-2048"
            onClick={() => redirectToGame('2048')}
            role="button"
            tabIndex={0}
            aria-label="Play 2048 game"
            onKeyDown={(e) => e.key === 'Enter' && redirectToGame('2048')}
          >
            <span className="game-icon" aria-hidden="true">🧩</span>
            <h2 className="game-title">2048</h2>
            <p className="game-description">
              Combine tiles and reach 2048 in this addictive puzzle game
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
            <span className="game-icon" aria-hidden="true">🐍</span>
            <h2 className="game-title">Snake</h2>
            <p className="game-description">
              Classic snake game - grow longer without hitting yourself
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
