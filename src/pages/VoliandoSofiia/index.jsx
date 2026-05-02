import React from 'react';
import VoliandoSofiiaGame from '../VoliandoSofiia';

const implementations = {
  'voliando-sofiia': VoliandoSofiiaGame,
};

function GameList() {
  const path = window.location.pathname.slice(1);
  const GameComponent = implementations[path];

  if (!GameComponent) {
    return (
      <div className="game-list">
        <h1>Виберіть гру:</h1>
        <ul>
          <li><a href="/voliando-sofiia">Voliando Sofiia - Minesweeper</a></li>
        </ul>
      </div>
    );
  }

  return <GameComponent />;
}

export default GameList;
