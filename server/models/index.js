const pool = require('../db');

exports.getReviews = (id, sort, count, page, callback) => {
  pool.query(`SELECT * FROM reviews FULL JOIN photos USING (review_id) WHERE reviews.product=${id} AND reviews.reported=false ORDER BY reviews.${sort} DESC`)
    .then((data) => {
      callback(null, data.rows);
    })
    .catch((err) => {
      console.error('error getting reviews: ', err);
      callback(err);
    });
};