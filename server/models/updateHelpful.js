const pool = require('../db');

exports.updateHelpful = (review_id, callback) => {
  pool.query(`UPDATE reviews SET helpfulness=helpfulness + 1 WHERE review_id=${review_id}`)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(`error updating helpful for review #${review_id}: `, err);
      callback(err);
    })
}