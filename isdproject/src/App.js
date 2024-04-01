import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import ErrorPage from './ErrorPage';
import Profile from './Profile';
import ResetPassword from './ResetPassword';
import WelcomePage from './WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set the root path to WelcomePage */}
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} /> 
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        {/* Provide a 404 error page for all undefined routes */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
