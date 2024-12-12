import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from './components/Room';
// import Login from './components/Login';
import Home from './components/Home';
import './index.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
