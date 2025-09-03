import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const NavBar = ({
  logo,
  years = [],            // array of "YYYY" strings
  selectedYear = '',     // '' means "All years"
  onYearChange = () => {}
}) => {
  // Toggle mobile menu (keeps your burger behavior)
  const toggleActive = (e) => {
    e.currentTarget.closest('nav').classList.toggle('active');
  };

  return (
    <nav id="navbar" className="navbar">

      {/* Logo (don’t nest <a> inside Link) */}
      <Link to="/" id="logo-container" aria-label="Home">
        <img id="logo" src={logo} alt="Logo" />
      </Link>

      {/* Year dropdown */}
      <div className="year-filter">
        <label htmlFor="yearSelect" className="sr-only">Filter by year</label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default NavBar;
