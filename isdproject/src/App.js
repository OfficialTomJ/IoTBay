import './tailwind.css';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './SignUp';
import ErrorPage from './ErrorPage';
import Profile from './Profile';
import ResetPassword from './ResetPassword';
import WelcomePage from './WelcomePage';
import LogoutPage from './Logout';
import Admin from './Admin';
import SearchUserAdmin from './SearchUserAdmin';
import UserLogAdmin from './UserLogAdmin';
import AdminDashboard from './AdminDashboard';
import ProductPage from './ProductPage';
import PaymentPage from './PaymentPage';
import ShoppingCart from './ShoppingCart';
import Checkout from './Checkout';
import UserAuthentication from './UserAuthentication';
import StaffLogin from './StaffLogin';
import StaffPage from './StaffPage';
import StaffSignup from './StaffSignup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set the root path to WelcomePage */}
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/profile" element={<Profile/>} /> {}
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        {/* Provide a 404 error page for all undefined routes */}
        <Route path="/logout" element={<LogoutPage/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/searchuseradmin" element={<SearchUserAdmin/>} />
        <Route path="/userlogadmin" element={<UserLogAdmin/>} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/product" element={<ProductPage/>} />
        <Route path="/ShoppingCart" element={<ShoppingCart/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/UserAuthentication" element={<UserAuthentication/>} />
        <Route path="/StaffLogin" element={<StaffLogin/>} />
        <Route path="/StaffPage" element={<StaffPage/>} />
        <Route path="/StaffSignup" element={<StaffSignup/>} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;