import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

//image address
const imageUrl = '/1.png';

const NavigationBar = () => {
  const navBarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000,
  };
//Navigation container style
  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
  };
//Navigation item style
  const navItemStyle = {
    margin: '0 15px',
    color: '#0047ab',
    textDecoration: 'none',
  };

  return (
    <nav style={navBarStyle}>
      <div style={navContainerStyle}>
        <div></div> {/* The empty div on the left is used to balance the layout */}
        {/* Middle navigation link */}
        <div>
          <a href="/menu" style={navItemStyle}>Menu</a>
          <a href="/contact" style={navItemStyle}>Contact</a>
          <a href="/about" style={navItemStyle}>About Us</a>
        </div>
        {/* Login and registration links on the right */}
        <div>
          <a href="/login" style={navItemStyle}>Login</a>
          <a href="/SignUp" style={navItemStyle}>Register</a>
        </div>
      </div>
    </nav>
  );
};

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
        <div style={containerStyle}>
          <h2 style={headingStyle}>Reset Password</h2>
          <p style={textStyle}>Resetting password for user: {userEmail}</p>
          <ResetPasswordForm onSubmit={handleResetPassword} />
        </div>
      ) : isValidHash && passwordResetSuccess ? (
        <div style={containerStyle}>
          <p style={textStyle}>Password reset successful!</p>
          <p style={textStyle}>
            <Link to="/login" style={linkStyle}>Go back to Login</Link>
          </p>
        </div>
      ) : (
        <p style={textStyle}>Invalid or expired reset password link</p>
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
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>Reset Password</button>
    </form>
  );
};

const containerStyle = {
  textAlign: 'center',
  marginTop: '4rem',
};

const headingStyle = {
  fontSize: '2rem',
  marginBottom: '1rem',
};

const textStyle = {
  fontSize: '1rem',
  marginBottom: '1rem',
};

const linkStyle = {
  color: '#0047ab',
  textDecoration: 'none',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '1rem',
};

const inputStyle = {
  padding: '0.5rem',
  margin: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#0047ab',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '1rem',
};

export default ResetPassword;
