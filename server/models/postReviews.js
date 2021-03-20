const pool = require('../db');

exports.postReviews = ({product_id, rating, summary, body, recommend, name, email, photos, characteristics}, callback) => {
  var queryString = `WITH insReviews AS (
    INSERT INTO reviews(product, rating, summary, recommend, body, reviewer_name, email)
    VALUES (${product_id}, ${rating}, '${summary}', ${recommend}, '${body}', '${name}', '${email}')
    RETURNING review_id AS review_id),`;

  if (photos.length > 0) {
    queryString += `insPhotos AS ( INSERT INTO photos (review_id, url) VALUES`
    for (let url of photos) {
      queryString +=`((SELECT review_id FROM insReviews), '${url}'),`
    }
    queryString = queryString.slice(0, queryString.length - 1);
    queryString += ')'
  } else {
    queryString = queryString.slice(0, queryString.length - 1);
  }

  queryString += 'INSERT INTO char_info (char_id, review_id, value) VALUES';

  for (let char in characteristics) {
    queryString += `(${char}, (SELECT review_id FROM insReviews), ${characteristics[char]}),`
  }

  queryString = queryString.slice(0, queryString.length - 1);

  pool.query(queryString)
    .then(() => {
      callback(null, 'successfully posted!');
    })
    .catch((err) => {
      console.error(`error posting review for product #${product_id}: `, err);
      callback(err);
    })
}

// if no photos!!!