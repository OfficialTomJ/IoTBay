import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";
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
          {/* Define routes */}
          <Route exact path="/" element={<ErrorPage/>} />
          <Route exact path="/signup" element={<Signup/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route exact path="/reset-password/:token" element={<ResetPassword/>} />
          {/* 404 Not Found route */}
        </Routes>
    </Router>
  );
}

export default App;
