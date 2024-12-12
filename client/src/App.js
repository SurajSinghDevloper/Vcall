import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from './components/Room';
// import Login from './components/Login';
import Home from './components/Home';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import AuthForm from './components/Login';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
