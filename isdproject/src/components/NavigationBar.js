import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import axios from 'axios';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      console.log(token);
      if (token) {
        try {
          const res = await axios.get('http://localhost:8080/api/user/profile', {
            headers: {
              Authorization: `${token}`
            }
          });
          setUser(res.data.user);
          console.log(res.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate('/Logout'); 
  };

  return (
    <header className="bg-white shadow-md text-xl fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex justify-center items-center space-x-8">
            <Link to="/products" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 font-medium">
              Product Categories
            </Link>
            <Link to="/contact" className="text-gray-900 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium">
              Contact us
            </Link>
            <Link to="/about" className="text-gray-900 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium">
              About Us
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex justify-end items-center space-x-4">
                <div className="flex items-center text-gray-700 px-3 py-2 rounded-md text-base font-medium">
                  Hello, {user.email}
                </div>
                <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex justify-end items-center space-x-4">
                <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Login
                </Link>
                <Link to="/signup" className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Register
                </Link>
              </div>
            )}
            <Link to="/ShoppingCart" className="group flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
              <span className="ml-2 text-base font-medium text-gray-700 group-hover:text-gray-800">(0)</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;





