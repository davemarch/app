/* global Papa */  // Papa comes from the CDN script in public/index.html

import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

import Main from './components/main/main.js';
import TourPage from './components/tourpage/tourpage.js';
import './App.css';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSU6-Ep6TvnoPu961DzWcJ8MTLd4elUA8OaupctfGJHPw0s2iMXtRY1HUXUtueG_JMtr8bvetQwNOEv/pub?gid=280621747&single=true&output=csv';

// ---- Helpers ----
const toIso = (s) => {
  if (!s) return '';
  const d = new Date(s);
  return isNaN(d) ? '' : d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const makeLocation = (city, region, country) => {
  const parts = [city, region, country].map((x) => (x || '').trim()).filter(Boolean);
  return parts.join(', ');
};

class App extends Component {
  state = {
    i: 0,
    loading: true,
    error: null,
    rows: [],      // raw CSV rows (debug)
    tours: [],     // grouped tours (what we send to <Main /> & <TourPage />)
    headerLogo: process.env.PUBLIC_URL + '/logo.png',
  };

  componentDidMount() {
    this.loadFromSheet();
  }

  loadFromSheet = async () => {
    try {
      const res = await fetch(CSV_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      const rows = Array.isArray(parsed.data) ? parsed.data : [];

      // --- Group rows into tours ---
      // Prefer tour_key if present; otherwise fall back to tour_title
      const groupKey = (r) => {
        const k = (r.tour_key ?? '').toString().trim();
        if (k) return `KEY:${k}`;
        const t = (r.tour_title ?? '').trim();
        return `TITLE:${t}`;
      };

      const byGroup = new Map();

      for (let idx = 0; idx < rows.length; idx++) {
        const r = rows[idx];
        const key = groupKey(r);
        if (!byGroup.has(key)) {
          byGroup.set(key, {
            key,
            title: (r.tour_title || '').trim(),                // keep blank if blank
            poster: (r.tour_poster_url || '').trim(),          // may be blank
            shows: [],
          });
        }
        const g = byGroup.get(key);

        // keep the first non-empty poster we encounter
        if (!g.poster && (r.tour_poster_url || '').trim()) {
          g.poster = (r.tour_poster_url || '').trim();
        }

        g.shows.push({
          dateIso: toIso(r.show_date),
          dateRaw: (r.show_date || '').trim(),
          venue: (r.show_venue || '').trim(),
          location: makeLocation(r.show_city, r.show_region, r.show_country),
          _rowIndex: idx, // original row index (handy later)
        });
      }

      // Build display-friendly tours (arrays aligned by index)
      const tours = Array.from(byGroup.values()).map((t) => {
        // Sort shows by date for consistent ordering
        t.shows.sort((a, b) => {
          const A = a.dateIso || a.dateRaw;
          const B = b.dateIso || b.dateRaw;
          return A > B ? 1 : A < B ? -1 : 0;
        });
        return {
          title: t.title,                     // may be empty; Main will decide to show/hide
          poster: t.poster,
          dates: t.shows.map((s) => s.dateIso || s.dateRaw).filter(Boolean),
          venue: t.shows.map((s) => s.venue),
          location: t.shows.map((s) => s.location),
          _rowIndices: t.shows.map((s) => s._rowIndex),
        };
      });

      // Optional: remove tours with no meaningful title or just a bare year
      const cleanedTours = tours.filter((t) => {
        const ttl = (t.title || '').trim();
        if (!ttl) return false;          // hide empty title
        if (/^\d{4}$/.test(ttl)) return false; // hide titles that are just a year
        return true;
      });

      // Sort tours by their first show date (ascending)
      cleanedTours.sort((a, b) => {
        const ad = a.dates[0] || '';
        const bd = b.dates[0] || '';
        return ad > bd ? 1 : ad < bd ? -1 : 0;
      });

      console.log('Loaded CSV rows:', rows.length, rows[0]);
      console.log('Grouped tours:', cleanedTours.length, cleanedTours[0]);

      this.setState({
        rows,
        tours: cleanedTours,
        loading: false,
        error: null,
      });
    } catch (e) {
      console.error(e);
      this.setState({ loading: false, error: e.message || String(e) });
    }
  };

  render() {
    const { i, loading, error, rows, tours } = this.state;

    return (
      <div className="App">
        {/* Simple header + counters so we can SEE what’s loaded */}
        <header style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={this.state.headerLogo} alt="Logo" style={{ height: 36 }} />
          <Link to="/main">
            <button>Show Database</button>
          </Link>
          {!loading && !error && (
            <div style={{ marginLeft: 'auto', color: '#888' }}>
              Rows: {rows.length} &nbsp;|&nbsp; Tours: {tours.length}
            </div>
          )}
        </header>

        {loading && <div style={{ padding: 16 }}>Loading tours…</div>}
        {error && <div style={{ padding: 16, color: 'crimson' }}>Couldn’t load tours: {error}</div>}

        {!loading && !error && (
          <Switch>
            {/* Grid: grouped tours */}
            <Route
              path="/main"
              render={(props) => (
                <Main
                  {...props}
                  handleToUpdate={(idx) => this.setState({ i: idx })}
                  i={i}
                  database={tours}
                />
              )}
            />

            {/* Detail page: index-based route */}
            <Route
              path="/tourpage/i/:idx"
              render={(props) => {
                const index = Number(props.match.params.idx);
                const tour = Number.isInteger(index) ? tours[index] : null;

                return tour ? (
                  <TourPage
                    {...props}
                    i={index}
                    tours={tours}
                    tour={tour}
                    title={tour.title}
                    poster={tour.poster}
                    date={tour.dates}
                    venue={tour.venue}
                    location={tour.location}
                  />
                ) : (
                  <Redirect to="/main" />
                );
              }}
            />

            {/* Default route */}
            <Redirect exact from="/" to="/main" />
          </Switch>
        )}
      </div>
    );
  }
}

export default App;
