import React from 'react';
import logoFile from '../../logo.png'
import '/navbar.css';
import { Link } from 'react-router-dom';


<img id="logo" src="/logo.png" alt="Logo" />

const NavBar = ({
  years = [],
  selectedYear = '',
  onYearChange = () => {}
}) => {
  const toggleActive = (e) => {
    e.currentTarget.closest('nav').classList.toggle('active');
  };

  return (
    <nav id="navbar" className="navbar">
      <Link to="/" id="logo-container" aria-label="Home">
        <img id="logo" src={logoFile} alt="Logo" />
      </Link>

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
