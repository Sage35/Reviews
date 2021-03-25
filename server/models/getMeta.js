const pool = require('../db');
const client = require('../redis.js');
// const stats = require('../controllers');

exports.getMeta = (id, callback) => {
  client.get(id, (err, data) => {
    if (err) {
      console.error(`error getting product #${id} from redis cache: ${err}`);
    }
    if (data !== null) {
      callback(null, JSON.parse(data));
      return;
    } else {
      const result = {
        product_id: id
      }
      // const ratingStart = new Date();
      pool.query(`SELECT rating, COUNT(*) FROM reviews where product=${id} and reported=false GROUP BY rating`)
        .then(({rows}) => {
          result.ratings = {
            1: "0",
            2: "0",
            3: "0",
            4: "0",
            5: "0"
          }
          for (let item of rows) {
            result.ratings[item.rating] = item.count;
          }
          // const ratingEnd = new Date() - ratingStart;
          // stats.client.timing('Meta_ratingQuery', ratingEnd);
        })
        .catch((err) => {
          console.error(`error adding ratings for product #${id}: `, err);
        })
        .then(() => {
          // const recommendStart = new Date();
          pool.query(`SELECT recommend, COUNT(*) FROM reviews where product=${id} and reported=false GROUP BY recommend ORDER BY recommend`)
            .then(({rows}) => {
              result.recommended = {
                false: 0,
                true: 0
              }
              for (let item of rows) {
                result.recommended[item.recommend] = item.count;
              }
              // const recommendEnd = new Date() - recommendStart;
              // stats.client.timing('Meta_recommendQuery', recommendEnd);
            })
            .catch((err) => {
              console.error(`error adding recommended for product #${id}: `, err);
            })
            .then(() => {
              // const charStart = new Date();
              pool.query(`SELECT chars.name, char_info.char_id, AVG(char_info.value) FROM chars FULL JOIN char_info ON chars.id=char_info.char_id WHERE chars.product_id=${id} GROUP BY chars.name, char_info.char_id`)
                .then(({rows}) => {
                  result.characteristics = {};
                  rows.map((char) => {
                    result.characteristics[char.name] = {
                      id: char.char_id,
                      value: char.avg
                    }
                    return char;
                  })
                  // const charEnd = new Date() - charStart;
                  // stats.client.timing('Meta_charsQuery', charEnd);

                  client.setex(id, 120, JSON.stringify(result));
                  callback(null, result);
                })
                .catch((err) => {
                  console.error(`error adding characteristics for product #${id}: `, err);
                })
            })
        })
        .catch((err) => {
          console.error(`error fetching meta characteristics for product #${id}: `, err);
          callback(err);
        })
    }
  })
}