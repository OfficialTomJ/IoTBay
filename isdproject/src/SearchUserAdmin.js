import React, { useState } from 'react';
import axios from 'axios';
import './SearchUserAdmin.css';

const SearchUserAdmin = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encodedName = encodeURIComponent(name);
    const encodedPhone = encodeURIComponent(phone);

    try {
      const response = await axios.get(`http://localhost:8080/api/admin/profile?name=${encodedName}&phone=${encodedPhone}`);
      if (response.data && response.data.user) {
        setFoundUser(response.data.user);
        setName(response.data.user.fullName);
        setPhone(response.data.user.phone);
        setEmail(response.data.user.email);
        setRole(response.data.user.role);
        setError('');
        setIsEditable(false);
      } else {
        setFoundUser(null);
        setError('No user found');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : 'No response');
      setError('Failed to fetch user data');
      setFoundUser(null);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/profile/${foundUser._id}`, {
        fullName: name,
        phone: phone,
        email: email,
        role: role
      });

      if (response.data) {
        setFoundUser(response.data.user);
        setIsEditable(false);
        setError('User information is successfully updated');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user data');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/admin/profile/${foundUser._id}`);
        if (response.status === 200) {
          setError("User successfully deleted");
          setFoundUser(null);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="container">
      <h2>Search User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <button type="submit" className="search">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      {foundUser && (
        <div className="user-details">
          <h3>User Found:</h3>
          {isEditable ? (
            <>
              <div>
                <label>Full Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label>Phone:</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label>User Role:</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="User">User</option>
                  <option value="Staff">Staff</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleDelete} className="delete" style={{ marginLeft: "10px" }}>Delete</button>
            </>
          ) : (
            <>
              <p>Full Name: {foundUser.fullName}</p>
              <p>Phone: {foundUser.phone}</p>
              <p>Email: {foundUser.email}</p>
              <p>User Type: {foundUser.role}</p>
              <button onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUserAdmin;
