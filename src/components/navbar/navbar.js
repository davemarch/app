import React from 'react';
import './navbar.css';
import { Link } from "react-router-dom";



const NavBar = (props) => {


let menuItems = props.menu.map(function(item, index){
    return <li key={index}><a  href={`#${item}`} onClick={function(e){e.currentTarget.closest('nav').classList.toggle('active');}}>{item}</a></li>
  });


    return (
    <nav id="navbar" className='navbar test'>
    <button className="burgerIcon" onClick={function(e){e.currentTarget.parentElement.classList.toggle('active');}}><span className="line"></span></button>   
    <ul>
    {menuItems}
    </ul>
    <Link to='/'>
    <a href='#' id='logo-container'><img id="logo" src={props.logo}/> </a>
    </Link>


    </nav>
    )
};


export default NavBar;