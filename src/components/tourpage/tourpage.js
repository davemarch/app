import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './tourpage.css';

class TourPage extends Component {
  render() {
    const { title, poster, date = [], venue = [], location = [] } = this.props;

    // Build show rows from aligned arrays
    const shows = date.map((d, i) => ({
      date: d,
      venue: venue[i] || '',
      location: location[i] || '',
    }));

    return (
      <div className="tourpage">
        <header className="tourpage__header">
          <Link to="/main" className="tourpage__back">← Back to all tours</Link>
          <h1 className="tourpage__title">{title || 'Tour'}</h1>
        </header>

        {poster && (
          <div className="tourpage__posterWrap">
            <img src={poster} alt={title || 'Poster'} className="tourpage__poster" />
          </div>
        )}

        <section className="tourpage__shows">
          <h2>Shows</h2>
          {shows.length ? (
            <ul className="tourpage__list">
              {shows.map((s, i) => (
                <li key={i} className="tourpage__row">
                  <span className="tourpage__cell tourpage__date">{s.date}</span>
                  <span className="tourpage__cell tourpage__venue">{s.venue}</span>
                  <span className="tourpage__cell tourpage__location">{s.location}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="tourpage__empty">No shows listed.</div>
          )}
        </section>
      </div>
    );
  }
}

export default TourPage;
