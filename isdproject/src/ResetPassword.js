import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [isValidHash, setIsValidHash] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  useEffect(() => {
    const verifyHashValidity = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/auth/verify-reset-token/${token}`);
        setIsValidHash(response.data.isValid);
        if (response.data.isValid) {
          setUserEmail(response.data.email);
        }
      } catch (error) {
        console.error('Error verifying hash validity:', error);
      }
    };

    verifyHashValidity();
  }, [token]);

  const handleResetPassword = async (newPassword) => {
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword });
      setPasswordResetSuccess(true);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {isValidHash && !passwordResetSuccess ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
          <p>Resetting password for user: {userEmail}</p>
          <ResetPasswordForm onSubmit={handleResetPassword} />
        </div>
      ) : isValidHash && passwordResetSuccess ? (
        <div className="mt-8">
          <p>Password reset successful!</p>
          <p>
            <Link to="/login" className="text-blue-500 hover:text-blue-700">Go back to Login</Link>
          </p>
        </div>
      ) : (
        <p className="mt-8">Invalid or expired reset password link</p>
      )}
    </div>
  );
};

const ResetPasswordForm = ({ onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    onSubmit(newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="block w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;