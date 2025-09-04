import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './main.css';
import '../header/header.css';

function hasCandidatePoster(p) {
  if (!p) return false;
  const s = String(p).trim();
  if (!s || s.toLowerCase() === 'n/a') return false;
  return /^https?:\/\//i.test(s) || s.startsWith('/') || s.startsWith('data:') || !s.includes(' ');
}

function PosterCard({ tour, originalIndex, onSelect }) {
  const [ok, setOk] = useState(false);

  return (
    <>
      <img
        src={tour.poster}
        alt=""
        style={{ display: 'none' }}
        onLoad={() => setOk(true)}
        onError={() => setOk(false)}
      />
      {ok ? (
        <Link
          to={`/tourpage/i/${originalIndex}`}    // ✅ use original DB index
          onClick={() => onSelect(originalIndex)} // ✅ pass original DB index
          className="gridItem"
          aria-label={`Open ${tour.title || 'Untitled'}`}
          title={tour.title || 'Untitled'}
        >
          <div className="posterWrap">
            <img
              src={tour.poster}
              alt={tour.title || 'Tour poster'}
              className="posterImg"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="meta">
            <h3 className="title">{tour.title || 'Untitled'}</h3>
          </div>
        </Link>
      ) : null}
    </>
  );
}

const Main = ({ database = [], handleToUpdate = () => {} }) => {
  // Build [tour, originalIndex] pairs, then filter
  const list = useMemo(() => {
    const arr = Array.isArray(database) ? database : [];
    return arr
      .map((t, i) => ({ tour: t, originalIndex: i })) // ✅ keep original index
      .filter(({ tour }) => {
        const ttl = (tour.title || '').trim();
        if (!ttl) return false;
        if (/^\d{4}$/.test(ttl)) return false;
        return hasCandidatePoster(tour.poster);
      });
  }, [database]);

  return (
    <div id="imgGrid">
      {list.map(({ tour, originalIndex }) => (
        <PosterCard
          key={`tour-${originalIndex}`}       // stable key from original index
          tour={tour}
          originalIndex={originalIndex}
          onSelect={handleToUpdate}
        />
      ))}
    </div>
  );
};

export default Main;
