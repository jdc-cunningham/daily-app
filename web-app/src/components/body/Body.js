import React, { useState } from 'react';
import './Body.scss';

const Body = () => {
  const [displayInfo, setDisplayInfo] = useState({
    daysSince: 1,
    prettyDate: 'Thursday 06/09/2022',
    totalDebt: '$73,000.00'
  });

  const [wokeUp, setWokeUp] = useState(false);
  const [weightSaved, setWeightSaved] = useState(false);

  const ButtonInput = (
    <button type="button">Woke up</button>
  );

  const WeightInput = (
    <input type="number" placeholder="weight"/>
  )

  return (
    <div className="daily-app__body">
      <div className="daily-app__body-info">
        <h1>Day {displayInfo.daysSince}</h1>
        <h2>{displayInfo.prettyDate}</h2>
        <h2>Total debt: <span className="red">{displayInfo.totalDebt}</span></h2>
      </div>
      <div className="daily-app__body-interfaces">
        {!wokeUp && ButtonInput}
        {wokeUp && !weightSaved && WeightInput}
      </div>
    </div>
  );
}

export default Body;
