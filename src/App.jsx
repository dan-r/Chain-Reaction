import React from 'react';
import { BrowserRouter as Router, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import Game from '@pages/Game';
import PlayerSelection from '@pages/PlayerSelection';
import './App.css';

const AnimationLayout = () => {
  const { pathname } = useLocation();
  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'linear',
    duration: 0.5
  };

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Outlet />
    </motion.div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AnimationLayout />}>
          {/* Player selection page */}
          <Route path="/cr/" element={<PlayerSelection />} />
          {/* Game page, where the number of players is passed as a prop */}
          <Route path="/cr/game/:players" element={<Game />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
