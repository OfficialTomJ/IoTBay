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
    <div>
      {isValidHash && !passwordResetSuccess ? (
        <div>
          <h2>Reset Password</h2>
          <p>Resetting password for user: {userEmail}</p>
          <ResetPasswordForm onSubmit={handleResetPassword} />
        </div>
      ) : isValidHash && passwordResetSuccess ? (
        <div>
          <p>Password reset successful!</p>
          <p>
            <Link to="/login">Go back to Login</Link>
          </p>
        </div>
      ) : (
        <p>Invalid or expired reset password link</p>
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
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
