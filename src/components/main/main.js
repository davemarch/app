import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';
import '../header/header.css';

const Main = ({ database = [], handleToUpdate = () => {} }) => {
  // Only keep tours with a real title (not just a bare year) AND with a poster
  const list = (Array.isArray(database) ? database : []).filter((t) => {
    const ttl = (t.title || '').trim();
    if (!ttl) return false;
    if (/^\d{4}$/.test(ttl)) return false;
    if (!t.poster || !t.poster.trim()) return false; // must have poster
    return true;
  });

  return (
    <div id="imgGrid">
      {list.map((tour, idx) => {
        const poster = tour.poster;
        const title = tour.title || 'Untitled';
        const path = `/tourpage/i/${idx}`;

        return (
          <Link
            to={path}
            key={`card-${idx}`}
            onClick={() => handleToUpdate(idx)}
            className="gridItem"
            aria-label={`Open ${title}`}
            title={title}
          >
            <div className="posterWrap">
              <img
                src={poster}
                alt={title}
                className="posterImg"
                loading="lazy"
              />
            </div>
            <div className="meta">
              <h3 className="title">{title}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Main;
