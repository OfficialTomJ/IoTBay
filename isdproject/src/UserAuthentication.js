import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserAuthentication() {
  const [code, setCode] = useState(''); 
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(''); 
  const [countdown, setCountdown] = useState(60); 
  const [canRequestCode, setCanRequestCode] = useState(false); 

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setEmail(userEmail);
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanRequestCode(true);
    }
  }, [countdown]);

  // Handle form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess(''); 
    try {
      await axios.post('http://localhost:8080/api/user/verify-email', { email, code });
      setSuccess('Verification successful. Redirecting to the product page...');
      window.location.href = '/Login';
    } catch (err) {
      setError(err.response?.data?.msg || 'Verification failed. Please try again.');
    }
  };

  const handleResendCode = async () => {
    if (!canRequestCode) return;
    try {
      const response = await axios.post('http://localhost:8080/api/user/resend-verification-code', { email });
      setSuccess(response.data.msg);
      setError(''); 
      setCountdown(60);
      setCanRequestCode(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend code. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <form className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-md" onSubmit={handleSubmit}>
        <label htmlFor="verification-code" className="text-lg font-semibold">
          Please enter verification code
        </label>
        <input
          id="verification-code"
          type="text"
          placeholder="6-digit verification code"
          className="w-full p-2 text-gray-700 border rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
        {countdown > 0 ? (
          <p>{countdown} seconds remaining until you can request a new code.</p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={!canRequestCode}
            className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Resend Code
          </button>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
}

export default UserAuthentication;
