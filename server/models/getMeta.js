const pool = require('../db');
const client = require('../redis.js');

exports.getMeta = (id, callback) => {
  client.get(id, (err, data) => {
    if (err) {
      console.error(`error getting product #${id} from redis cache: ${err}`);
    }
    if (data !== null) {
      callback(null, JSON.parse(data));
      return;
    } else {
      var obj = {
        product_id: id
      };
      getRatings(id, obj)
        .then((resultObj) => {
          return getRecommend(id, resultObj)
        })
        .then((resultObj) => {
          return getChars(id, resultObj);
        })
        .then((result) => {
          client.setex(id, 5, JSON.stringify(result));
          callback(null, result);
        })
        .catch((err) => {
          console.error(`error fetching meta characteristics for product #${id}: `, err);
          callback(err);
        })
    }
  })
};

var getRatings = (id, result) => {
  return pool.query(`SELECT rating, COUNT(*) FROM reviews where product=${id} and reported=false GROUP BY rating`)
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
      return result;
    })
    .catch((err) => {
      console.error(`error adding ratings for product #${id}: `, err);
    })
};

var getRecommend = (id, result) => {
  return pool.query(`SELECT recommend, COUNT(*) FROM reviews where product=${id} and reported=false GROUP BY recommend ORDER BY recommend`)
    .then(({rows}) => {
      result.recommended = {
        false: 0,
        true: 0
      }
      for (let item of rows) {
        result.recommended[item.recommend] = item.count;
      }
      return result;
    })
    .catch((err) => {
      console.error(`error adding recommended for product #${id}: `, err);
    })
};

var getChars = (id, result) => {
  return pool.query(`SELECT chars.name, char_info.char_id, AVG(char_info.value) FROM chars FULL JOIN char_info ON chars.id=char_info.char_id WHERE chars.product_id=${id} GROUP BY chars.name, char_info.char_id`)
    .then(({rows}) => {
      result.characteristics = {};
      rows.map((char) => {
        result.characteristics[char.name] = {
          id: char.char_id,
          value: char.avg
        }
        return char;
      })
      return result;
    })
    .catch((err) => {
      console.error(`error adding characteristics for product #${id}: `, err);
    })
};
