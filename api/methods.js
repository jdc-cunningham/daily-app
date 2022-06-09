const { pool } = require('./dbConnect');

const addWakeUpTimeStamp = (req, res) => {
  const { date, timestamp } = req.body;

  // ooh fancy, no this is actually bad
  pool.query(
    `${'INSERT INTO entries SET date = ?, wake_up_time = ?'}`,
      [date, timestamp],
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

  // ooh fancy, no this is actually bad
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

};

module.exports = {
  addWakeUpTimeStamp,
  addWeight,
  getDayEntry
}