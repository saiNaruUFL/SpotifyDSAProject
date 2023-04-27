import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const navStyle = {
    display: 'flex',
    height: '50px',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: 'black',
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
   
  };

  const linkStyle = {
    color: 'green',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)',
    marginRight: '20px',
  };

  const activeLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)',
    marginRight: '20px',
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/main" style={linkStyle}>
        Visualization
      </Link>
      <Link to="/albums" style={linkStyle}>
        Albums
      </Link>
    </nav>
  );
};

export default NavBar;
