import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [resetLink, setResetLink] = useState('');

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', formData);
      const { token } = res.data;
      Cookies.set('token', token, { expires: 1 / 24 }); // Expires in 1 hour
      navigate('/profile');
    } catch (err) {
      console.error(err.response); // Handle error response
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Send request to server to generate reset password token
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', { email });
      const resetLinkURL = response.data;

      // Display the custom URL in the UI
      setResetLink(resetLinkURL);
    } catch (error) {
      console.error('Error requesting password reset:', error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Email Address"
        name="email"
        value={email}
        onChange={onChange}
        required
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={onChange}
        required
      />
      <button type="submit">Login</button>
      <button onClick={handleForgotPassword}>Forgot Password</button>
      {resetLink && (
        <div>
          <p>{resetLink.msg}</p>
          <a href={resetLink.link}>Reset password link: {resetLink.link}</a>
        </div>
      )}
    </form>
  );
};

export default Login;
