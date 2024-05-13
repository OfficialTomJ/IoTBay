import React, { useState } from 'react';
import EmployeeInfo from './components/EmployeeInfo';
import OrderManagement from './components/OrderManagement';
import CustomerInfo from './components/CustomerInfo';
import ProductInfo from './components/ProductInfo';

function StaffPgae() {
    const [activeTab, setActiveTab] = useState('employeeInfo');

    const renderComponent = () => {
        switch (activeTab) {
            case 'employeeInfo': return <EmployeeInfo />;
            case 'orderManagement': return <OrderManagement />;
            case 'customerInfo': return <CustomerInfo />;
            case 'productInfo': return <ProductInfo />;
            default: return <EmployeeInfo />;
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-blue-500 text-white p-5">
                <h2 className="text-xl mb-5">Hello Staff !</h2>
                <ul>
                    <li className="mb-2 p-2 cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => setActiveTab('employeeInfo')}>Personal Information</li>
                    <li className="mb-2 p-2 cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => setActiveTab('orderManagement')}>Order Tracking</li>
                    <li className="mb-2 p-2 cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => setActiveTab('customerInfo')}>Customer Information Search</li>
                    <li className="mb-2 p-2 cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => setActiveTab('productInfo')}>Product Information</li>
                </ul>
            </div>
            <div className="flex-grow p-5">
                {renderComponent()}
            </div>
        </div>
    );
}

export default  StaffPgae;





