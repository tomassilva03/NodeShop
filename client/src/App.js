import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/registerPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<RegisterPage/>} />
        <Route exact path="/login" element={<LoginPage/>} />
        <Route exact path="/" element={<HomePage/>} />
      </Routes>
    </Router>
  );
};

export default App;