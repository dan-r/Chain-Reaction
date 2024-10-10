import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './Game';
import PlayerSelection from './PlayerSelection';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Player selection page */}
        <Route path="/cr/" element={<PlayerSelection />} />
        {/* Game page, where the number of players is passed as a prop */}
        <Route path="/cr/game/:players" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;
