import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/admin">Register New User / Staff</Link></li>
          <li><Link to="/searchuseradmin">Search User / Edit Profile</Link></li>
          <li><Link to="/userlogadmin">User Log</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
