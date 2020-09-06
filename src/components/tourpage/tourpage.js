import React from 'react';
import './tourpage.css';



const TourPage = (props) => {

    // console.log(props.tours[props.i])


    let mapThru = (props) => {

        var i = 0;
        var date_list = [];


        for (i = 0; i < props.tours[props.i].dates.length; ++i){
            date_list.push(
                <tr>
                    <td>{props.tours[props.i].dates[i]}</td>
                    <td>{props.tours[props.i].venue[i]}</td>
                    <td>{props.tours[props.i].location[i]}</td>
                </tr>
            )
        }
        return <div>
                <tr>
                <th>Date</th>
                <th>Venue</th>
                <th>Town/City</th>
            </tr>
            {date_list}
        </div>

    }

    

    return (
    <div id="tourpage">
        <p>{props.title}</p>
        <img id = 'poster' src={props.poster}/>
        <table>
            {mapThru(props)}
        </table>
    </div>
    )
};


export default TourPage;