import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function EmployeeInfo() {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [searchTime, setSearchTime] = useState('');
    const [userLogs, setUserLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchUserData(token);
        }
    }, [navigate]);

    const fetchUserData = async (token) => {
        try {
            const res = await axios.get('http://localhost:8080/api/user/profile', {
                headers: { Authorization: token }
            });
            setUser(res.data.user);
            setFullName(res.data.user.fullName);
            setEmail(res.data.user.email);
            setPhone(res.data.user.phone);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserLogs();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const token = Cookies.get('token');
            await axios.put('http://localhost:8080/api/user/profile', { fullName, email, phone }, {
                headers: { Authorization: token }
            });
            fetchUserData(token);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const fetchUserLogs = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('http://localhost:8080/api/user/logs', {
                headers: { Authorization: token }
            });
            setUserLogs(response.data.userLogs);
        } catch (error) {
            console.error('Error fetching user logs:', error);
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

    const logout = () => {
        Cookies.remove('token');
        navigate('/Logout');
    };

    return (
        <div style={{ backgroundColor: '#e3f2fd', minHeight: '100vh', padding: 20 }}>
            <button onClick={logout} style={{ position: 'absolute', top: 20, right: 20, backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: 'pointer' }}>
                Logout
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '80%', maxWidth: 800, backgroundColor: '#fff', borderRadius: 8, padding: 40, boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)', position: 'relative' }}>
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: 24, marginBottom: 10 }}>User Logs</h2>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: 8, padding: 20 }}>
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
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {userLogs.map((log, index) => (
                            <li key={index} style={{ marginBottom: 8, fontSize: 14 }}>{log.timestamp}: {log.eventType}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EmployeeInfo;
