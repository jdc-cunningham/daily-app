import React, { useState, SetStateAction, useEffect } from 'react';
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
  );

  // straight outta SO
  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const formatDate = () => {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;

    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  };

  // first run
  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_BASE}/get-day-entry`, {
      date: `${formatDate()} 00:00:00`
    })
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
};

export default Body;
