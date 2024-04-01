import React from 'react';

//image address
const imageUrl = '/1.png';

const NavigationBar = () => {
  const navBarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000,
  };
//Navigation container style
  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
  };
//Navigation item style
  const navItemStyle = {
    margin: '0 15px',
    color: '#0047ab',
    textDecoration: 'none',
  };

  return (
    <nav style={navBarStyle}>
      <div style={navContainerStyle}>
        <div></div> {/* The empty div on the left is used to balance the layout */}
        {/* Middle navigation link */}
        <div>
          <a href="/menu" style={navItemStyle}>Menu</a>
          <a href="/contact" style={navItemStyle}>Contact</a>
          <a href="/about" style={navItemStyle}>About Us</a>
        </div>
        {/* Login and registration links on the right */}
        <div>
          <a href="/login" style={navItemStyle}>Login</a>
          <a href="/SignUp" style={navItemStyle}>Register</a>
        </div>
      </div>
    </nav>
  );
};

function WelcomePage() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
    padding: '0 10%',
    color: '#0047ab',
    marginTop: '4rem', // Make space for navigation bar
  };

  const textContainerStyle = {
    maxWidth: '40%',
  };

  const helloStyle = {
    fontSize: '152px',
    margin: '0 0 24px 0',
    fontWeight: 'bold',
  };

  const seeYouStyle = {
    fontSize: '44px',
    margin: '0 0 24px 0',
  };

  const startButtonStyle = {
    padding: '12px 24px',
    fontSize: '18px',
    backgroundColor: '#0047ab',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    outline: 'none',
  };

  const imageStyle = {
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
    maxHeight: '1000px',
    maxWidth: '1000px',
  };

  return (
    <div>
      <NavigationBar />
      <div style={containerStyle}>
        <div style={textContainerStyle}>
          <h1 style={helloStyle}>Hello!</h1>
          <p style={seeYouStyle}>Go to see you here</p>
          <button style={startButtonStyle}>Go to Start</button>
        </div>
        <div>
          <img src={imageUrl} alt="Decorative" style={imageStyle} />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;