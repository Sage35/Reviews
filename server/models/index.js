const {getReviews} = require('./getReviews.js');
const {postReviews} = require('./postReviews.js');
const {updateHelpful} = require('./updateHelpful.js');
const {updateReport} = require('./updateReport.js');
const {getMeta} = require('./getMeta.js');

module.exports = {
  getReviews,
  postReviews,
  updateHelpful,
  getMeta,
  updateReport
}

