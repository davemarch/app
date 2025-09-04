/* global Papa */  // Papa comes from the CDN script in public/index.html

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from 'react-router-dom';

import Main from './components/main/main';                 // ✅ lowercase to match disk
import TourPage from './components/tourpage/tourpage';     // ✅ lowercase to match disk
import './App.css';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSe-47e3MTqxRZoQ__yG7rqcm_SbBtsdqC4ZQKkEx8fEdgQXX9DJrDsXGGYl6kNjoIxxvRSLrplsTRA/pub?output=csv';



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
    rows: [],      // raw CSV rows
    tours: [],     // grouped tours
    headerLogo: process.env.PUBLIC_URL + '/logo.png', // requires public/logo.png
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
            title: (r.tour_title || '').trim(),
            poster: (r.tour_poster_url || '').trim(),
            shows: [],
          });
        }
        const g = byGroup.get(key);

        if (!g.poster && (r.tour_poster_url || '').trim()) {
          g.poster = (r.tour_poster_url || '').trim();
        }

        g.shows.push({
          dateIso: toIso(r.show_date),
          dateRaw: (r.show_date || '').trim(),
          venue: (r.show_venue || '').trim(),
          location: makeLocation(r.show_city, r.show_region, r.show_country),
          _rowIndex: idx,
        });
      }

      const tours = Array.from(byGroup.values()).map((t) => {
        t.shows.sort((a, b) => {
          const A = a.dateIso || a.dateRaw;
          const B = b.dateIso || b.dateRaw;
          return A > B ? 1 : A < B ? -1 : 0;
        });
        return {
          title: t.title,
          poster: t.poster,
          dates: t.shows.map((s) => s.dateIso || s.dateRaw).filter(Boolean),
          venue: t.shows.map((s) => s.venue),
          location: t.shows.map((s) => s.location),
          _rowIndices: t.shows.map((s) => s._rowIndex),
        };
      });

      const cleanedTours = tours.filter((t) => {
        const ttl = (t.title || '').trim();
        if (!ttl) return false;
        if (/^\d{4}$/.test(ttl)) return false;
        return true;
      });

      cleanedTours.sort((a, b) => {
        const ad = a.dates[0] || '';
        const bd = b.dates[0] || '';
        return ad > bd ? 1 : ad < bd ? -1 : 0;
      });

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
    const { i, loading, error, rows, tours, headerLogo } = this.state;

    return (
      <Router>
        <div className="App">
          {/* Fixed black header */}
          <header id='header'
          //style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'black', color: 'white' }}
          >
            <img id='logo' src={headerLogo} alt="Logo"  />
            <Link to="/main" className='showDataButton'>
              <button>Show Database</button>
            </Link>
            {!loading && !error && (
              <div id='statusText'>
                Rows: {rows.length} &nbsp;|&nbsp; Tours: {tours.length}
              </div>
            )}
          </header>

          {/* Loading / error */}
          {loading && <div style={{ padding: 16 }}>Loading tours…</div>}
          {error && <div style={{ padding: 16, color: 'crimson' }}>Couldn’t load tours: {error}</div>}

          {/* Routes */}
          {!loading && !error && (
            <Switch>
              {/* Grid */}
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

              {/* Tour detail */}
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

              {/* Default */}
              <Redirect exact from="/" to="/main" />
            </Switch>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
