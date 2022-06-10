const { pool } = require('./dbConnect');

const addWakeUpTimeStamp = (req, res) => {
  const { date, timestamp } = req.body;

  pool.query(
    `${'INSERT INTO entries SET wake_up_time = ? WHERE date = ?'}`,
    [timestamp, date],
    (err, qRes) => {
      if (err) {
        console.log(err);
        res.status(400).json({ok: false});
      } else {
        res.status(201).json({ok: true});
      }
    }
  );
};

const addWeight = (req, res) => {
  const { weight, date } = req.body;

  pool.query(
    `${'UPDATE entries SET weight = ? WHERE date = ?'}`,
    [weight, date],
    (err, qRes) => {
      if (err) {
        console.log(err);
        res.status(400).json({ok: false});
      } else {
        res.status(200).json({ok: true});
      }
    }
  );
}

const getDayEntry = (req, res) => {
  const { date } = req.body;

  pool.query(
    `${'SELECT wake_up_time, weight, previous_debt, current_debt from entries WHERE date = ?'}`,
    [date],
    (err, qRes) => {
      if (err) {
        console.log(err);
        res.status(400).json({ok: false});
      } else {
        res.status(200).json({data: qRes});
      }
    }
  );
};

module.exports = {
  addWakeUpTimeStamp,
  addWeight,
  getDayEntry
}