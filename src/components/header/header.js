import React from 'react';
import './header.css';
import NavBar from "../navbar/navbar.js";


const Header = (props) => {
    return (
    <header id="headerWrap">
        <span id="header">
        {props.heading}
        </span>
        <NavBar logo = {props.logo}  menu = {props.menu} />
    </header>
    )
};


export default Header;