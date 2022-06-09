const { pool } = require('./dbConnect');

const addWakeUpTimeStamp = async (req, res) => {
  const { date, timestamp } = req.body;

  return new Promise(resolve => {
    // ooh fancy, no this is actually bad
    pool.query(
      `${'INSERT INTO entries SET date = ?, timestamp = ?'}`,
        [date, timestamp],
      (err, qRes) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const addWeight = async (req, res) => {

}

const getDayEntry = async (req, res) => {

};

module.exports = {
  addWakeUpTimeStamp,
  addWeight,
  getDayEntry
}