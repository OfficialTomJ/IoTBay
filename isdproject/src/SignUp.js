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
  const navigate = useNavigate();

  const { fullName, email, password, phone } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/user/register', formData);
      console.log(res.data); // Handle success response
      localStorage.setItem('userEmail', email);
      navigate('/signUpTest'); // Redirect to verification code input page
    } catch (err) {
      console.error(err.response.data); // Handle error response
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
            value={fullName}
            onChange={onChange}
            required
          />
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
          <input
            style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={phone}
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

