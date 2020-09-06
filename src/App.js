import React, { Component } from 'react';
import logo from './logo.png';
import jan2010_USA_poster from './jan2010_USA_poster.jpg';
import nov2010_UK_poster from './nov2010_UK_poster.png';
import sept2010_UK_poster from './sept2010_UK_poster.jpg';
import jan2020_EUROPE_poster from './jan2020_EUROPE_poster.jpg';
import Header from './components/header/header.js'
import Main from './components/main/main.js'
import './App.css';
import TourPage from './components/tourpage/tourpage.js';
import { Link } from "react-router-dom";
import {
  Route,
  NavLink,
  Switch
} from "react-router-dom";


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  handleToUpdate = (someArg) => {
    this.setState(state => ({
      i: someArg
    }));}

  state = {
    i : 0,
    Header : { heading : <span>'Show Database'</span>,
                logo : logo,
                menu : ['2010', '2011', '2012', '2013', '2014', '2015','2016','2017','2018', '2019', '2020']},
    Main : [
        {key: 0, year: ["2010"] , tours: ['tour a', 'tour b', 'tour c', 'extra'] , date: ['tour a - first date', 'tour b - first date', 'tour c - first day']},

    ],
    tours : [
      {key : 0,
        title : 'Spring 2010 - USA',
        poster : jan2010_USA_poster,
        link : '/tourpage',
        dates : ['January 12th 2010', 'January 13th 2010','January 14th 2010','January 15th 2010','January 16th 2010','February 6th 2010',],
        venue : ['The Magic Stick', 'Bottom Lounge', 'Station 4', 'Sokol Underground', 'Cervantes Masterpiece Ballroom', 'Mr Smalls'],
        location : ['Detroit, MI', 'Chicago, IL', 'St Paul, MN', 'Omaha, NE', 'Denver, CO', 'Pittsbury, PA']
        },
      {key : 1,
        title : 'Fall 2010 - USA',
        poster : sept2010_UK_poster,
        link : "/tourpage",
        dates : ['September 21st 2010', 'September 22nd 2010', 'September 23rd 2010','September 24th 2010','September 25th 2010','September 26th 2010','September 27th 2010'],
        venue : ['Ottobar', 'The Bell House', 'The Met Cafe','Le Studio','Imperial','Ritual Nightclub','Time to Laugh'],
        location : ['Baltimore, MA', 'Brooklyn, NY', 'Pawtucket, RI', 'Montreal, Quebec', 'Quebec, Quebec', 'Ottawa, Ontario', 'Kingston','Ontario']
        },
        {key : 2,
          title : 'Fall 2010 - UK',
          poster : nov2010_UK_poster,
          link : '/tourpage',
          dates : ['November 11th 2010', 'November 12th 2010', 'November 13th 2010','November 14th 2010','November 15th 2010','November 16th 2010','November 17th 2010', 'November 18th 2010', 'November 19th 2010', 'November 20th 2010'],
          venue : ['The Fighting Cocks', 'Unit', 'Sigma','The Croft','Tiger Lounge','13th Note','Northumberland Arms','The Bell Hotel','Club Revolution','Old Blue Last'],
          location : ['Kingston', 'Southampton', 'Swansea', 'Bristol', 'Manchester', 'Glasgow', 'Newcastle','Derby','Peterborough','London']
          },
        {key : 3,
          title : 'Winter 2020 - Europe',
          poster : jan2020_EUROPE_poster,
          link : "/tourpage",
          dates : ['January 25th 2020', 'January 26th 2020', 'January 28th 2020', 'January 29th 2020', 'January 30th 2020', 'January 31st 2020', 'February 1st 2020', 'February 3rd 2020', 'February 4th 2020', 'February 6th 2020', 'February 7th 2020', 'February 8th 2020', 'February 10th 2020', 'February 11th 2020', 'February 12th 2020', 'February 14th 2020', 'February 15th 2020'],
          venue : ['Gruespan', 'Bi Nuu', 'WuK', 'Dynamo', 'Universum', 'Technikum', 'Kantine', 'Melkweg', 'Zappa', 'Engine Rooms', 'SWX', 'Albert Hall', 'Whelans', 'QMU', 'The Riverside','The Asylum','O2 Forum Kentish Town'],
          location : ['Hamburg, Germany', 'Berlin, Germany', 'Vienna, Austria', 'Zurich, Germany', 'Stuttgart, Germany', 'Munich, Germany', 'Cologne, Germany', 'Amsterdam, Netherlands', 'Antwerp, Belgium','Southampton, UK', 'Bristol, UK' ,'Manchester, UK', 'Dublin, Ireland', 'Glasgow, UK', 'Newcastle, UK', 'Birmingham, UK', 'London, UK']
          }
    ]
  }



  render() {

    return (
      
      <div className="App">
        <Header 
          heading = {this.state.Header.heading} 
          logo = {this.state.Header.logo}
          menu = {this.state.Header.menu}
          />
        <Link to='/main'>
        <div class='link2'>
        <button variant="outlined">
        Show Database
        </button>
        </div>
        </Link>

        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
          <Route path='/tourpage' component={TourPage}>
            <TourPage 
            i = {this.state.i}
            tours = {this.state.tours}
            title = {this.state.tours[this.state.i].title}
            poster = {this.state.tours[this.state.i].poster}
            date = {this.state.tours[this.state.i].dates}
            venue = {this.state.tours[this.state.i].venue}
            location ={this.state.tours[this.state.i].location}
            />
          </Route>
          <Route path='/main' component={Main}>
            <Main
                handleToUpdate = {this.handleToUpdate}
                i = {this.state.i}
                menu = {this.state.Header.menu}
                database = {this.state.tours}
            >
            </Main>
          </Route>
        </Switch>



      </div>
);

    }}
  




export default App;
