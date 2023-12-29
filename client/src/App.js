import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/register';
import HomePage from './pages/register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<RegisterPage/>} />
        <Route exact path="/" element={<HomePage/>} />
      </Routes>
    </Router>
  );
};

export default App;