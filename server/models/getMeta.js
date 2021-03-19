const pool = require('../db');

exports.getMeta = (callback) => {
  callback(null, 'hello getMeta!');
}