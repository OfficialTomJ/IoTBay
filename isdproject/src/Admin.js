import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/admin/register', formData);
      console.log(res.data);
      setSuccessMessage('Registration successful!');
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div className="container">
      <h2>Register Form</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={onChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" placeholder="Phone Number" name="phone" value={formData.phone} onChange={onChange} required />
        </div>
        <div>
          <label>User Type:</label>
          <select name="role" value={formData.role} onChange={onChange}>
            <option value="User">User</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <button type="submit" className="register">Register</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default Admin;
