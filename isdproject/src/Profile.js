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
  const [userLogs, setUserLogs] = useState([]);
  const [searchTime, setSearchTime] = useState('');
  const [shipments, setShipments] = useState([]);
  const [newShipment, setNewShipment] = useState({
    orderId: '',
    shipmentMethod: '',
    address: '',
    status: '',
    tracking: '',
    date: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
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
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    fetchUserLogs();
    fetchUserShipments();
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

  const fetchUserShipments = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get('http://localhost:8080/api/shipment/user-shipments', {
        headers: {
          Authorization: `${token}`
        }
      });
      setShipments(response.data.shipments);
    } catch (error) {
      console.error('Error fetching user shipments:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/logout');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    try {
      const token = Cookies.get('token');
      await axios.delete('http://localhost:8080/api/user', {
        headers: {
          Authorization: `${token}`
        }
      });
      Cookies.remove('token');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/generate-password-token', { email });
      const resetUrl = response.data;
      window.open(resetUrl.link, '_blank');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put('http://localhost:8080/api/user/profile', { fullName, email, phone }, {
        headers: {
          Authorization: `${token}`
        }
      });
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

  const handleSearchLogs = () => {
    const filteredLogs = userLogs.filter(log => log.timestamp.includes(searchTime));
    setUserLogs(filteredLogs);
  };

  const handleResetSearch = () => {
    setSearchTime('');
    fetchUserLogs();
  };

  const handleNewShipmentChange = (e) => {
    const { name, value } = e.target;
    setNewShipment(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddShipment = async () => {
    try {
      const token = Cookies.get('token');
      console.log(newShipment);
      const response = await axios.post('http://localhost:8080/api/shipment/create', newShipment, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Shipment created:', response.data);
      fetchUserShipments();
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  const handleDeleteShipment = (index) => {
    const updatedShipments = [...shipments];
    updatedShipments.splice(index, 1);
    setShipments(updatedShipments);
  };

  return (
    <div style={{ backgroundColor: '#e3f2fd', minHeight: '100vh', padding: 20 }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <button
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4
          }}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '80%', maxWidth: 800, backgroundColor: '#fff', borderRadius: 8, padding: 40, boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>Profile</h2>
            {user && (
              <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Full Name:</label>
                  {isEditable ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  ) : (
                    <span>{fullName}</span>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Email:</label>
                  {isEditable ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  ) : (
                    <span>{email}</span>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Phone:</label>
                  {isEditable ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                  ) : (
                    <span>{phone}</span>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Role:</label> {user.role}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4 }} onClick={() => {
                    setIsEditable(!isEditable);
                    if (isEditable) {
                      handleUpdateProfile();
                    }
                  }}>
                    {isEditable ? 'Save' : 'Edit'}
                  </button>
                  <button style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4 }} onClick={handleResetPassword}>Reset Password</button>
                  <button style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4 }} onClick={handleDeleteAccount}>Delete Account</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>User Logs</h2>
            <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20 }}>
              <input
                type="text"
                placeholder="Search by time..."
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)}
                style={{ marginBottom: 10, padding: '8px 12px', fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <button style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }} onClick={handleSearchLogs}>Search</button>
              {searchTime && (
                <button style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }} onClick={handleResetSearch}>Reset</button>
              )}
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {userLogs.map((log, index) => (
                  <li key={index} style={{ marginBottom: 8, fontSize: 14 }}>{log.timestamp}: {log.eventType}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>Previous Shipments</h2>
            <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20 }}>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  name="orderId"
                  value={newShipment.orderId}
                  onChange={handleNewShipmentChange}
                  placeholder="Order ID"
                  style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  name="shipmentMethod"
                  value={newShipment.shipmentMethod}
                  onChange={handleNewShipmentChange}
                  placeholder="Shipment Method"
                  style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  name="address"
                  value={newShipment.address}
                  onChange={handleNewShipmentChange}
                  placeholder="Address"
                  style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  name="status"
                  value={newShipment.status}
                  onChange={handleNewShipmentChange}
                  placeholder="Status"
                  style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  name="tracking"
                  value={newShipment.tracking}
                  onChange={handleNewShipmentChange}
                  placeholder="Tracking"
                  style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4 }} onClick={handleAddShipment}>Add Shipment</button>
              </div>
            </div>
            {shipments.length === 0 && (
              <p>No previous shipments available</p>
            )}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {shipments.map((shipment, index) => (
                <li key={index} style={{ marginBottom: 8 }}>
                  <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
                    <div><strong>Order ID:</strong> {shipment.orderId}</div>
                    <div><strong>Shipment Method:</strong> {shipment.shipmentMethod}</div>
                    <div><strong>Address:</strong> {shipment.address}</div>
                    <div><strong>Status:</strong> {shipment.status}</div>
                    <div><strong>Tracking:</strong> {shipment.tracking}</div>
                    <div><strong>Date:</strong> {shipment.date}</div>
                    <div style={{ textAlign: 'right', marginTop: 5 }}>
                      <button style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4 }} onClick={() => handleDeleteShipment(index)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;