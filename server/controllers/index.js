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

  const dbStart = new Date();
  models.getReviews(id, sort, count, page, (err, data) => {
    if (err) {
      console.error('error getting reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('getReviews_db', dbEnd);
      res.status(200).send(data);
    }
  })
};

exports.getMeta = (req, res) => {
  client.increment('getMeta');
  const id = req.query.product_id || 17;

  const dbStart = new Date();
  models.getMeta(id, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('getMeta_db', dbEnd);
      res.status(200).send(data);
    }
  })
};

exports.postReviews = (req, res) => {
  client.increment('postReview');

  const dbStart = new Date();
  models.postReviews(req.body, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('postReviews_db', dbEnd);
      res.status(201).send(data);
    }
  })
};

exports.updateHelpful = (req, res) => {
  client.increment('updateHelpful');

  const dbStart = new Date();
  models.updateHelpful(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('updateHelpful_db', dbEnd);
      res.status(201).send(data);
    }
  })
};

exports.updateReport = (req, res) => {
  client.increment('updateReport');

  const dbStart = new Date();
  models.updateReport(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('updateReport_db', dbEnd);
      res.status(201).send(data);
    }
  })
};

exports.client = client;