import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/NodeShop/register" element={<RegisterPage/>} />
        <Route exact path="/NodeShop/login" element={<LoginPage/>} />
        <Route exact path="/NodeShop" element={<HomePage/>} />
      </Routes>
    </Router>
  );
};

export default App;