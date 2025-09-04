// Header.js
import React from 'react';
import '.header/header.css';
import NavBar from "../navbar/navbar.js";

const Header = (props) => {
  return (
    <header className="headerWrap">
      <span className="header">{props.heading}</span>
      <NavBar menu={props.menu} />   {/* no logo prop needed */}
    </header>
  );
};

export default Header;
