import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';

const Main = ({ database = [], handleToUpdate = () => {} }) => {
  // Only keep tours with a real title and not just a bare year
  const list = (Array.isArray(database) ? database : []).filter((t) => {
    const ttl = (t.title || '').trim();
    if (!ttl) return false;
    if (/^\d{4}$/.test(ttl)) return false;
    return true;
  });

  return (
    <div id="imgGrid">
      {list.map((tour, idx) => {
        const poster = tour.poster || '';
        const title = tour.title || 'Untitled';
        const path = `/tourpage/i/${idx}`; // index-based route

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
              {poster ? (
                <img src={poster} alt={title} className="posterImg" loading="lazy" />
              ) : (
                <div className="posterPlaceholder">{title}</div> 
              )}
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
