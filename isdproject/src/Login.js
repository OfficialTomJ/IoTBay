import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(false);  // Add new setting error status
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
      console.log(token);
      Cookies.set('token', token, { expires: 1 / 24 }); // Expires in 1 hour
        try {
          const res = await axios.get('http://localhost:8080/api/user/profile', {
            headers: {
              Authorization: `${token}`
            }
          });
          console.log(res);
          console.log(res.data.user.fullName);
          console.log(res.data.user.email);
          console.log(res.data.user.phone);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      navigate('/profile');
    } catch (err) {
      console.error(err.response); // Handle error response
      setError(true);  // Add new setting error status
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Send request to server to generate reset password token
      const response = await axios.post('http://localhost:8080/api/auth/generate-password-token', { email });
      const resetLinkURL = response.data;

      // Display the custom URL in the UI
      setResetLink(resetLinkURL);
    } catch (error) {
      console.error('Error requesting password reset:', error);
    }
  };

  const navigateSignUp = async () => {
    navigate('/SignUp');
  }; 



  return (
    <div style={{ display: 'flex'}}>
      <div className='leftPageBg'> 
        <div className='welcomeText'>Welcome</div> 
      </div>
  <div className='rightPageBg'>
    <form onSubmit={onSubmit}>
      <div className='loginText'> Login </div>
      <div className='inline'> Don't have an account? </div> 
      <button type="button" onClick={navigateSignUp} className='registerText' > Register </button>
      <div className='emailText'> Email </div>
      <input
        type="email"
        placeholder="Email Address"
        name="email"
        value={email}
        onChange={onChange}
        className={error ? 'inputBox error' : 'inputBox'} // Conditional class name application
        required
      />
      <div style={{fontWeight: 'bold'}}> Password </div>
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={onChange}
        className={error ? 'inputBox error' : 'inputBox'} // Conditional class name application
        required
      />
      {error && <div className='errorText'>The account or password is wrong, please try again.</div>} 
      <div><input type="checkbox"/> <div className='inline'> Remember me</div> 
      
      <button type="button" onClick={handleForgotPassword} className='forgotPw' >Forgot Password</button>
      {resetLink && (
        <div>
          <p>{resetLink.msg}</p>
          <a href={resetLink.link}>Reset password link: {resetLink.link}</a>
        </div>
      )}</div> 
      <button type="submit"
        className='loginBox'
      >Login</button>
    </form></div>
</div> 
  );
};

export default Login;
