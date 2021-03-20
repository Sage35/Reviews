const pool = require('../db');

exports.updateReport = (review_id, callback) => {
  pool.query(`UPDATE reviews SET reported=true WHERE review_id=${review_id}`)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(`error updating report for review #${review_id}: `, err);
      callback(err);
    })
}