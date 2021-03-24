const models = require('../models');
require('dotenv').config();
const StatsD = require('node-statsd');
const client = new StatsD({
  host: process.env.STATSD,
  port: 8125,
  prefix: 'SDC_',
});

client.socket.on('error', function(error) {
  return console.error("Error in socket: ", error);
});

exports.getReviews = (req, res) => {
  const start = new Date();
  client.increment('getReviews');
  const id = req.query.product_id || 17;
  const sort = req.query.sort || 'rating';
  const count = req.query.count || 5;
  const page = req.query.page || 1;

  models.getReviews(id, sort, count, page, (err, data) => {
    if (err) {
      console.error('error getting reviews: ', err);
      res.sendStatus(500);
    } else {
      res.status(200).send(data);
    }
    const end = new Date() - start;
    client.timing('getReviews_response', end);
  })
};

exports.getMeta = (req, res) => {
  const start = new Date();
  client.increment('getMeta');
  const id = req.query.product_id || 17;

  models.getMeta(id, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
  const end = new Date() - start;
  client.timing('getMeta_response', end);
};

exports.postReviews = (req, res) => {
  const start = new Date();
  client.increment('postReview');
  models.postReviews(req.body, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
  const end = new Date() - start;
  client.timing('postReviews_response', end);
};

exports.updateHelpful = (req, res) => {
  const start = new Date();
  client.increment('updateHelpful');
  models.updateHelpful(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
  const end = new Date() - start;
  client.timing('updateHelpful_response', end);
};

exports.updateReport = (req, res) => {
  const start = new Date();
  client.increment('updateReport');
  models.updateReport(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
  const end = new Date() - start;
  client.timing('updateReport_response', end);
};

