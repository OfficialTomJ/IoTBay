import React from 'react';
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {
  return (
    <header className="bg-white shadow-md text-xl fixed top-0 w-full z-50"> {/*Fixed navigation bar*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* middle navigation link*/}
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

          {/* Login, registration and shopping cart icons on the right */}
          <div className="flex items-center space-x-4">
            <div className="flex justify-end items-center space-x-4">
              <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium"> 
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Login
              </Link>
              <Link to="/signup" className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Register
              </Link>
              <Link to="/ShoppingCart" className="group flex items-center" > 
                <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                <span className="ml-2 text-base font-medium text-gray-700 group-hover:text-gray-800">(0)</span> 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;





