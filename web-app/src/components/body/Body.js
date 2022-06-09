import React, { useState, useEffect } from 'react';
import './Body.scss';
import axios from 'axios';

const Body = () => {
  const [displayInfo, setDisplayInfo] = useState({});
  const [weight, setWeight] = useState(null);

  const wokeUp = () => {
    axios.post(`${process.env.REACT_APP_API_BASE}/insert-day-wake-up-timestamp`, {
      date: `${formatDate()} 00:00:00`,
      timestamp: Date.now()
    })
      .then((res) => {
        if (res.status === 201) {
          setTimeout(() => {
            window.location.reload(true);
          }, 250);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const saveWeight = (weight) => {
    axios.post(`${process.env.REACT_APP_API_BASE}/insert-day-weight`, {
      weight,
      date: `${formatDate()} 00:00:00`
    })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            window.location.reload(true);
          }, 250);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const ButtonInput = (
    <button
      className="main-orange"
      type="button"
      onClick={() => wokeUp()}
    >
      Woke up
    </button>
  );

  const WeightInputUI = (
    <div className="daily-app__body-interfaces-group">
      <input
        type="number"
        placeholder="weight"
        onChange={(e) => {
          if (e.target.value.length <= 3) {
            setWeight(e.target.value);
          }
        }}
        value={weight}
      />
      <button
        type="button"
        onClick={() => {
          saveWeight(weight)
        }}
      >
        Save
      </button>
    </div>
  );

  // straight outta SO
  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const formatDate = (dashes = false) => {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;

    if (day.length < 2) 
        day = '0' + day;

    const bridgeStr = dashes ? '/' : '-';

    return [year, month, day].join(bridgeStr);
  };

  const daysSinceStart = () => {
    return Math.floor(
      (((Date.now() - 1654800933538)) / 1000) / 86400
    );
  }

  const prettyDate = () => {
    // https://stackoverflow.com/a/24998705/2710227
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    return days[d.getDay()];
  }

  // first run
  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_BASE}/get-day-entry`, {
      date: `${formatDate()} 00:00:00`
    })
      .then((res) => {
        if (res.status === 200) {
          const { data } = res.data;
          const firstRow = data[0];

          setDisplayInfo(prevState => ({
            ...prevState,
            daysSince: daysSinceStart(),
            prettyDate: `${prettyDate()} ${formatDate(true)}`,
            prevDebt: '',
            currentDebt: '',
            wakeUpTime: firstRow?.wake_up_time,
            weightSaved: firstRow?.weight
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="daily-app__body">
      <div className={`daily-app__body-info ${!displayInfo.wakeUpTime ? "center" : ""}`}>
        {displayInfo.wakeUpTime &&
          <>
            <h1>Day {displayInfo.daysSince}</h1>
            <h2>{displayInfo.prettyDate}</h2>
            {displayInfo.weightSaved && <h2>Weight: {displayInfo.weightSaved} lbs</h2>}
            {displayInfo.prevDebt && <h2>Previous debt: <span className="orange">{displayInfo.prevDebt}</span></h2>}
            {displayInfo.currentDebt && <h2>Current debt: <span className="red">{displayInfo.currentDebt}</span></h2>}
          </>
        }
        {!displayInfo.wakeUpTime &&
          <h1>Wake up, Jacob</h1>
        }
      </div>
      <div className="daily-app__body-interfaces">
        {!displayInfo.wakeUpTime && ButtonInput}
        {displayInfo.wakeUpTime && !displayInfo.weightSaved && WeightInputUI}
      </div>
    </div>
  );
};

export default Body;
