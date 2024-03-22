import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showSignInButton, setShowSignInButton] = useState(false);
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/users/register', formData);
      console.log(res.data); // Handle success response
      setSuccessMessage('Registration successful! Click the button to Sign In.');
      setShowSignInButton(true);
    } catch (err) {
      console.error(err.response.data); // Handle error response
    }
  };

  const handleSignInClick = () => {
    // Redirect to Sign In page using history.push
    navigate('/login');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={onChange}
          required
        />
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
          minLength="6"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {successMessage && (
        <div>
          <p>{successMessage}</p>
          {showSignInButton && (
            <button onClick={handleSignInClick}>Go to Sign In</button>
          )}
        </div>
      )}
    </div>
  );
};

export default SignUp;
