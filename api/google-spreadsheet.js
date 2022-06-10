// based on https://isd-soft.com/tech_blog/accessing-google-apis-using-service-account-node-js/
// requires service account configured with key
// also have to share spreadsheet with your service account email

require('dotenv').config({
  path: __dirname + '/.env'
});

const { google } = require('googleapis');
const privateKey = require(`./${process.env.PRIVATE_KEY_JSON_PATH}`);
const sheets = google.sheets('v4');

const jwtClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const authenticate = async () => {
  return new Promise(resolve => {
    jwtClient.authorize(function (err, tokens) {
      resolve(!err);
    });
  });
};

// this returns for example A13
const getEmptyRow = async () => {
  return new Promise(resolve => {
    sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: process.env.SHEET_ID,
      range: `${process.env.TAB_NAME}!Z33:Z200` // future problem, past 1000 lol that's far like 27 years if ran thrice a month
    }, (err, res) => {
      if (err) {
        resolve(false);
      } else {
        if (res.data) {
          const lastRow = 33 + res.data.values.length;
          resolve(`Z${lastRow}`);
        } else {
          resolve(false);
        }
      }
    });
  });
}

/**
 * look at this, a docblock!
 * // reference: https://developers.google.com/sheets/api/guides/values
 */
const getLatestDebtColumnRow = async () => {
  const authenticated = await authenticate();

  return new Promise(async (resolve) => {
    if (authenticated) {
      const lastRow =  await getEmptyRow(); // eg. A13
      const lastRowLetter = lastRow[0];
      const lastRowNum = parseInt(lastRow.split(lastRowLetter)[1]);
      const range = `${process.env.TAB_NAME}!Z${lastRowNum - 1}:Z${lastRowNum}`;

      sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SHEET_ID,
        range
      }, (err, res) => {
        if (err) {
          // handle this err
          console.log(err);
          resolve(false);
        } else {
          resolve(res.data.values);
        }
      });
    } else {
      resolve(false);
    }
  });
}

module.exports = {
  getLatestDebtColumnRow
};