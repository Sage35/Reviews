const pool = require('../db');
const client = require('../redis.js');

exports.getReviews = (id, sort, count, page, callback) => {
  sort = changeSort(sort);

  client.get(`${id}_${sort}_${count}_${page}`, (err, data) => {
    if (err) {
      console.error(`error getting product #${id} from redis cache: ${err}`);
    }
    if (data !== null) {
      callback(null, JSON.parse(data));
      return;
    } else {
      const obj = {
        product: id,
        page,
        count
      };

      getReviews(id, sort, count, page, obj)
        .then((resultObj) => {
          return getPhotos(id, resultObj);
        })
        .then((result) => {
          client.setex(`${id}_${sort}_${count}_${page}`, 5, JSON.stringify(result));
          callback(null, result);
        })
        .catch((err) => {
          console.error(`error getting reviews for product #${id}: `, err);
          callback(err);
        });
    }
  })
};

var changeSort = (sort) => {
  if (sort === 'relevant') {
    sort = 'rating'
  } else if (sort === 'helpful') {
    sort = 'helpfulness'
  } else if (sort === 'newest') {
    sort = 'date'
  }

  return sort;
};

var getReviews = (id, sort, count, page, result) => {
  return pool.query(`SELECT * FROM reviews WHERE reviews.product=${id} AND reviews.reported=false ORDER BY reviews.${sort} DESC LIMIT ${count} OFFSET ${count * (page - 1)}`)
    .then((data) => {
      result.results = data.rows
      return result;
    })
};

var getPhotos = (id, result) => {
  const reviews = result.results
  return pool.query(`SELECT photos.review_id, photos.id, photos.url FROM photos LEFT JOIN (SELECT review_id, product, reported FROM reviews) r USING (review_id) WHERE r.product=${id} AND r.reported=false`)
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
      return result;
    })
};