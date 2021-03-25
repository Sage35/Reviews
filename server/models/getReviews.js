const pool = require('../db');
const client = require('../redis.js');

exports.getReviews = (id, sort, count, page, callback) => {
  if (sort === 'relevant') {
    sort = 'rating'
  } else if (sort === 'helpful') {
    sort = 'helpfulness'
  } else if (sort === 'newest') {
    sort = 'date'
  }

  client.get(`${id}_${sort}_${count}_${page}`, (err, data) => {
    if (err) {
      console.error(`error getting product #${id} from redis cache: ${err}`);
    }
    if (data !== null) {
      callback(null, JSON.parse(data));
      return;
    } else {
      const result = {
        product: id,
        page,
        count
      };

      pool.query(`SELECT * FROM reviews WHERE reviews.product=${id} AND reviews.reported=false ORDER BY reviews.${sort} DESC LIMIT ${count} OFFSET ${count * (page - 1)}`)
        .then((data) => {
          result.results = data.rows
          return result.results;
        })
        .then((reviews) => {
          const photos = pool.query(`SELECT photos.review_id, photos.id, photos.url FROM photos LEFT JOIN (SELECT review_id, product, reported FROM reviews) r USING (review_id) WHERE r.product=${id} AND r.reported=false`)
            .then(({rows}) => {
              reviews.map((review) => {
                review.photos = [];
                for (let photo of rows) {
                  if (photo.review_id === review.review_id) {
                    review.photos.push({
                      id: photo.id,
                      url: photo.url
                    })
                  }
                }
                return review;
              })
            })
            .then(() => {
              client.setex(`${id}_${sort}_${count}_${page}`, 120, JSON.stringify(result));
              callback(null, result);
            })
            .catch((err) => {
              console.error(`error getting reviews for product #${id}: `, err);
              callback(err);
            });
        })
    }
  })
};
