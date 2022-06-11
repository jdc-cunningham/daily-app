const { pool } = require('./dbConnect');
const { getLatestDebtColumnRow } = require('./google-spreadsheet');

const _getLatestDebtFromSpreadsheet = async () => {
  return new Promise(async resolve => {
    const getVals = await getLatestDebtColumnRow();
    resolve(getVals || false);
  });
};

const addWakeUpTimeStamp = async (req, res) => {
  const { date, timestamp } = req.body;
  const latestDebtRes = await _getLatestDebtFromSpreadsheet();
  let latestDebt;
  
  if (latestDebtRes) {
    latestDebt = latestDebtRes[0][0];
  } else {
    res.status(400).json({ok: false});
  }

  pool.query(
    `${'INSERT INTO entries SET date = ?, wake_up_time = ?, current_debt = ?'}`,
    [date, timestamp, latestDebt],
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
};

const _getTodayRow = (date) => {
  return new Promise(resolve => {
    pool.query(
      `${'SELECT id FROM entries WHERE date = ?'}`,
      [date],
      (err, qRes) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(qRes);
        }
      }
    );
  });
}

const getDayEntry = async (req, res) => {
  const { date } = req.body;
  const todayRowId = await _getTodayRow(date);

  if (!todayRowId) {
    console.log('failed to get today row');
    res.status(400).json({ok: false});
    return;
  }

  pool.query(
    `${'SELECT wake_up_time, weight, current_debt FROM entries WHERE id >= ? ORDER BY id DESC'}`,
    [parseInt(todayRowId[0]?.id) - 1],
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
};