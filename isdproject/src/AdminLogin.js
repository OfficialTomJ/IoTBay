import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const navigate = useNavigate(); //HOOK

    const handleLogin = (event) => {
        event.preventDefault();
        navigate('/AdminPage'); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Administrator Information Management System</h2>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Admin Login</h1>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;



