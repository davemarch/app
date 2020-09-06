import React from 'react';
import './main.css';
import { Link } from "react-router-dom";
import { useState } from 'react';



const Main = (props) => {



        let mapThru = (props) => {

            var	handleToUpdate	=	props.handleToUpdate;

    


        let i = 0;
        let tour_list = [];
        
        for (i = 0; i < props.database.length; ++i){
        let value = props.database[i].key;
        tour_list.push(
            <div>
                <Link 
                to={props.database[i].link}
                >         
                    <h2 onClick={() => handleToUpdate(value)}>{props.database[i].title}</h2>
                </Link>
            </div>
            )
        }

        return <div>
        <h1>{props.database[i]} </h1>
        {tour_list}
        </div> 
    }


        return (
        <div id="main">
            {mapThru(props)}
        </div>
        );
}

export default Main;