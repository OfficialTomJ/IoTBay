import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState(''); // Add error message status
  const navigate = useNavigate();

  const onChange = e => {
    if (error) setError(''); // the user starts typing, clear the error message
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/user/register', formData);
      console.log(res.data); // Handle success response
      localStorage.setItem('userEmail', formData.email); 
      navigate('/UserAuthentication'); //  Redirect to verification code input page
    } catch (err) {
      console.error(err.response.data); // Handle error response
      setError(err.response.data.error || 'This email address has already been registered, please change to another email address.'); 
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Sign Up</h2>
        <form onSubmit={onSubmit}>
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            required
          />
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={onChange}
            required ={{ borderColor: error.includes('Email') ? 'red' : 'inherit' }} 
          />
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
            minLength="6"
            required
          />
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            required
          />
          <button
            style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', padding: '10px', cursor: 'pointer' }}
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
