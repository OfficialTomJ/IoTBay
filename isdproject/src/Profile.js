import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

// Import NavigationBar component
const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [userLogs, setUserLogs] = useState([]);
  const [searchTime, setSearchTime] = useState('');
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

  const fetchUserLogs = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('http://localhost:8080/api/user/logs', {
          headers: {
            Authorization: token,
          },
        });
        setUserLogs(response.data.userLogs);
      } catch (error) {
        console.error('Error fetching user logs:', error);
      }
    };

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const handleLogout = () => {
    // Delete token cookie
    Cookies.remove('token');
    // Redirect to logout page
    navigate('/Logout');
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
      const response = await axios.post('http://localhost:8080/api/auth/generate-password-token', { email });
      const resetUrl = response.data;
      // Open the reset URL in a new tab
      window.open(resetUrl.link, '_blank');
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
  
  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '18px',
    backgroundColor: '#0047ab',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    outline: 'none',
  };

  const bigStyle = {
    fontSize: '152px',
    margin: '0 0 24px 0',
    fontWeight: 'bold',
  };

  const smallStyle = {
    fontSize: '44px',
    margin: '0 0 24px 0',
  };

  const containerStyle = {
    width: 1440,
    height: 1285,
    position: 'relative',
    background: 'white',
  };

  const headingStyle = {
    width: 466,
    height: 215,
    left: 129,
    top: 27,
    position: 'absolute',
    color: 'black',
    fontSize: 80,
    fontFamily: 'Inter',
    fontWeight: '900',
    lineHeight: 88,
    wordWrap: 'break-word',
  };

  const roleContainerStyle = {
    width: 250,
    height: 56,
    left: 189,
    top: 913,
    position: 'absolute',
    color: 'black',
    fontSize: 30,
    fontFamily: 'Inter',
    fontWeight: '900',
    lineHeight: 45,
    wordWrap: 'break-word',
  };

  const roleValueContainerStyle = {
    width: 789,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    left: 395,
    top: 938,
    position: 'absolute',
    background: 'white',
    borderRadius: 8,
    border: '1px #E0E0E0 solid',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
    display: 'inline-flex',
  };

  const roleValueStyle = {
    width: 789,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    background: 'white',
    borderRadius: 8,
    border: '1px #E0E0E0 solid',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
    display: 'inline-flex',
  };

  const searchLogsContainerStyle = {
    width: 1167,
    height: 988,
    left: 157,
    top: 242,
    position: 'absolute',
    background: 'white',
    borderRadius: 50,
    border: '1px black solid',
  };

  const searchLogsInputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '16px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Profile</div>
      <div style={{ ...roleContainerStyle }}>Role:</div>
      <div style={roleValueContainerStyle}>
        <div style={{ ...roleValueStyle }}>{user ? user.role : ''}</div>
      </div>
      <div style={searchLogsContainerStyle}>
        <h2>User Logs</h2>
        <input
          type="text"
          placeholder="Search by time..."
          value={searchTime}
          onChange={(e) => setSearchTime(e.target.value)}
          style={searchLogsInputStyle}
        />
        <button >Search</button>
        {searchTime && (
          <button >Reset</button>
        )}
        <ul>
          {userLogs.map((log, index) => (
            <li key={index}>{log.timestamp}: {log.eventType}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;