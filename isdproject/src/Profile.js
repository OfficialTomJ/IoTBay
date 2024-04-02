import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
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

  const handleSearchLogs = () => {
    // Filter user logs based on searchTime
    const filteredLogs = userLogs.filter(log => log.timestamp.includes(searchTime));
    setUserLogs(filteredLogs);
  };

  const handleResetSearch = () => {
  setSearchTime('');
    // Call the function to fetch user logs without any search filter
    fetchUserLogs();
  };


  return (
    <div>
      <h2 style={bigStyle}>Profile</h2>
      {user && (
        <div>
          <div>
            <span style={smallStyle}>Full Name:</span>
            {isEditable ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              <span style={smallStyle}>{fullName}</span>
            )}
          </div>
          <div>
            <span style={smallStyle}>Email:</span>
            {isEditable ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <span style={smallStyle}>{email}</span>
            )}
          </div>
          <div>
            <span style={smallStyle}>Phone:</span>
            {isEditable ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            ) : (
              <span style={smallStyle}>{phone}</span>
            )}
          </div>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <button style={buttonStyle} onClick={() => {
          setIsEditable(!isEditable);
          if (isEditable) {
              handleUpdateProfile();
          }
      }}>
          {isEditable ? 'Save' : 'Edit'}
      </button>
      <button style={buttonStyle} onClick={handleResetPassword}>Reset Password</button>
      <button style={buttonStyle} onClick={handleLogout}>Log Out</button>
      <button style={buttonStyle} onClick={handleDeleteAccount}>Delete Account</button>


      <div>
      <h2>User Logs</h2>
      <input
          type="text"
          placeholder="Search by time..."
          value={searchTime}
          onChange={(e) => setSearchTime(e.target.value)}
        />
        <button onClick={handleSearchLogs}>Search</button>
        {searchTime && (
          <button onClick={handleResetSearch}>Reset</button>
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

