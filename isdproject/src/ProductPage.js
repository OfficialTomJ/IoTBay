import './tailwind.css';
import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import PaginationLogic from './components/PaginationLogic';

function ProductPage() {
  const products = Array.from({ length: 300 }, (_, index) => index + 1); // Set up virtual goods
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30; // Set how many products are on a page
  const navigate = useNavigate(); // Create history object for redirection

  const handleClick = (number) => {
    if (number === "...") {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(number);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const { startPage, endPage } = PaginationLogic({ totalPages, currentPage });

  useEffect(() => {
    initializeBuyButtons(); // Initialize buy buttons when component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col justify-center items-center bg-gray-50">
        <div className="flex flex-wrap justify-center items-start py-4">
          {currentProducts.map((product, index) => (
            <div key={index} className="w-1/6 p-2">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img 
                  src={`https://via.placeholder.com/150?text=Product${product}`} 
                  alt={`Product ${product}`}
                  className="w-full h-auto rounded"
                />
                <p className="mt-2 text-gray-600 text-center">Product {product}</p>
                <p className="mt-1 text-gray-700 text-center">Price: $10.00</p>
                <button 
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-8 bg-blue-500 text-white text-center rounded-lg shadow-md">
          <div className="flex justify-center">
            <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1} className="text-white hover:text-gray-300 font-bold py-2 px-4 mr-2">
              &lt; Previous
            </button>
            <div className="flex items-center">
              {[...Array(endPage - startPage + 1)].map((_, i) => (
                <button 
                  key={startPage + i}
                  onClick={() => handleClick(startPage + i)}
                  className={`text-white hover:text-gray-300 font-bold py-2 px-4 mx-1 ${startPage + i === currentPage ? 'bg-blue-700' : ''}`}
                >
                  {startPage + i}
                </button>
              ))}
            </div>
            <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages} className="text-white hover:text-gray-300 font-bold py-2 px-4 ml-2">
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
