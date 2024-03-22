import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Read token from cookie
    const token = Cookies.get('token');

    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/user/profile', {
          headers: {
            Authorization: `${token}`
          }
        });
        setUser(res.data.user);
        setFullName(res.data.user.fullName);
        setEmail(res.data.user.email);
        setPhone(res.data.user.phone);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      // If no token is found, redirect to login page
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    // Delete token cookie
    Cookies.remove('token');
    // Redirect to login page
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    try {
      // Send request to delete account
      const token = Cookies.get('token');
      await axios.delete('http://localhost:8080/api/user', {
        headers: {
          Authorization: `${token}`
        }
      });
      
      // Clear token cookie and redirect to login page
      Cookies.remove('token');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      // Send request to reset password
      const token = Cookies.get('token');
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', { email: user.email });
      const resetUrl = response.data.resetUrl;
      // Open the reset URL in a new tab
      window.open(resetUrl, '_blank');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Send request to update profile
      const token = Cookies.get('token');
      await axios.put('http://localhost:8080/api/user/profile', { fullName, email, phone }, {
        headers: {
          Authorization: `${token}`
        }
      });
      // Refresh user data
      const res = await axios.get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `${token}`
        }
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <div>
            <span>Full Name:</span>
            {isEditable ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              <span>{fullName}</span>
            )}
          </div>
          <div>
            <span>Email:</span>
            {isEditable ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <span>{email}</span>
            )}
          </div>
          <div>
            <span>Phone:</span>
            {isEditable ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            ) : (
              <span>{phone}</span>
            )}
          </div>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <button onClick={() => {
          setIsEditable(!isEditable);
          if (isEditable) {
              handleUpdateProfile();
          }
      }}>
          {isEditable ? 'Save' : 'Edit'}
      </button>
      <button onClick={handleResetPassword}>Reset Password</button>
      <button onClick={handleLogout}>Log Out</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default Profile;

