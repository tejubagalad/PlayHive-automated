import React from 'react';
import './App.css'; // Import the CSS file

const App = () => {
  const redirectToGame = (game) => {
    const gameUrls = {
      '2048': 'http://2048.gamehub.local',
      'snake': 'http://snake.gamehub.local'
    };
    window.location.href = gameUrls[game];
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="title">Game Hub</h1>
        <p className="subtitle">Choose your adventure</p>
        
        <div className="games-grid">
          <div 
            className="game-card game-card-2048"
            onClick={() => redirectToGame('2048')}
          >
            <span className="game-icon">🧩</span>
            <h2 className="game-title">2048</h2>
            <p className="game-description">
              Combine tiles and reach 2048 in this addictive puzzle game
            </p>
          </div>
          
          <div 
            className="game-card game-card-snake"
            onClick={() => redirectToGame('snake')}
          >
            <span className="game-icon">🐍</span>
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
