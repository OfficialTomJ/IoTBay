import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function SignUpTest() {
  const [code, setCode] = useState(''); //Verification code input
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // Used to display error messages
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setEmail(userEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:8080/api/user/verify-email', { email, code });
      window.location.href = '/login';
    } catch (err) {
      setError(err.response.data.msg || 'Verification failed, please try again');
    }
  };


  return (
    <div className="flex justify-center items-center w-full h-screen">
      <form className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-md" onSubmit={handleSubmit}>
        <label htmlFor="verification-code" className="text-lg font-semibold">
        please enter verification code
        </label>
        <input
          id="verification-code"
          type="text"
          placeholder="6-digit verification code"
          className="w-full p-2 text-gray-700 border rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default UserAuthentication;
