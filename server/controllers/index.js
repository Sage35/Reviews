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
  client.increment('getReviews');
  const id = req.query.product_id || 17;
  const sort = req.query.sort || 'rating';
  const count = req.query.count || 5;
  const page = req.query.page || 1;

  models.getReviews(id, sort, count, page, (err, data) => {
    if (err) {
      console.error('error getting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
};

exports.getMeta = (req, res) => {
  client.increment('getMeta');
  const id = req.query.product_id || 17;

  models.getMeta(id, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
};

exports.postReviews = (req, res) => {
  client.increment('postReview');
  models.postReviews(req.body, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
};

exports.updateHelpful = (req, res) => {
  client.increment('updateHelpful');
  models.updateHelpful(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
};

exports.updateReport = (req, res) => {
  client.increment('updateReport');
  models.updateReport(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
};

