import React, { useState, useEffect } from 'react';
import './Body.scss';
import axios from 'axios';

const Body = () => {
  const [displayInfo, setDisplayInfo] = useState({
    daysSince: 1,
    prettyDate: 'Thursday 06/09/2022',
    prevDebt: '$74,000.00',
    currentDebt: '$73,000.00'
  });

  const [wokeUp, setWokeUp] = useState(false);
  const [weightSaved, setWeightSaved] = useState(false);

  const ButtonInput = (
    <button type="button">Woke up</button>
  );

  const WeightInput = (
    <input type="number" placeholder="weight"/>
  )

  const getDateTime = () => {
    // from https://stackoverflow.com/questions/8083410/how-can-i-set-the-default-timezone-in-node-js
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date in YYYY-MM-DD format
    // console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  }

  // first run
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/get-day-entry`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="daily-app__body">
      <div className="daily-app__body-info">
        <h1>Day {displayInfo.daysSince}</h1>
        <h2>{displayInfo.prettyDate}</h2>
        <h2>Previous debt: <span className="orange">{displayInfo.prevDebt}</span></h2>
        <h2>Current debt: <span className="red">{displayInfo.currentDebt}</span></h2>
      </div>
      <div className="daily-app__body-interfaces">
        {!wokeUp && ButtonInput}
        {wokeUp && !weightSaved && WeightInput}
      </div>
    </div>
  );
}

export default Body;
