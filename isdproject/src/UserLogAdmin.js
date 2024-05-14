import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserLogAdmin.css';

const UserLogAdmin = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserLogs = async (userId) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null); // Close logs if the same user is clicked again
      return;
    }

    if (!logs[userId]) {
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/logs/${userId}`);
        setLogs((prevLogs) => ({ ...prevLogs, [userId]: response.data }));
      } catch (error) {
        console.error('Error fetching user logs:', error);
      }
    }
    setSelectedUserId(userId); // Open logs for the clicked user
  };

  return (
    <div className="container">
      <h1>User List</h1>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id}>
            <div>
              <strong>Name:</strong> {user.fullName}, <strong>Email:</strong> {user.email}, <strong>Phone:</strong> {user.phone}, <strong>Role:</strong> {user.role}
            </div>
            <button onClick={() => fetchUserLogs(user._id)}>
              {selectedUserId === user._id ? 'Close' : 'Log'}
            </button>
            {selectedUserId === user._id && logs[user._id] && (
              <ul className="logs-list">
                {logs[user._id].map((log, index) => (
                  <li key={index}>{log.timestamp}: {log.eventType}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserLogAdmin;
