import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const BASE_URL = 'http://localhost:8080/api/auth';
function StaffLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch(`${BASE_URL}/loginStaff`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            const { token } = data;
            Cookies.set('token', token, { expires: 1 / 24 }); // Expires in 1 hour
            console.log('Login Success:', data);
            navigate('/StaffPage');
        } else {
            const errorData = await response.json();
            alert('Failed to login: ' + errorData.msg);
        }
    };

    const navigateToSignUp = () => {
        navigate('/StaffSignup'); 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Staff Information Management System</h2>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Staff Login</h1>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                    <div>
                        <button type="button" onClick={navigateToSignUp} className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
                            Register as Staff
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StaffLogin;
