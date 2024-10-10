import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './Game';
import PlayerSelection from './PlayerSelection';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Player selection page */}
        <Route path="/" element={<PlayerSelection />} />
        {/* Game page, where the number of players is passed as a prop */}
        <Route path="/game/:players" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;
