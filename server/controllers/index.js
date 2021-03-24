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
  const resStart = new Date();
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
    const resEnd = new Date() - resStart;
    client.timing('getReviews_response', resEnd);
  })
};

exports.getMeta = (req, res) => {
  const resStart = new Date();
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
    const resEnd = new Date() - resStart;
    client.timing('getMeta_response', resEnd);
  })
};

exports.postReviews = (req, res) => {
  const resStart = new Date();
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
    const resEnd = new Date() - resStart;
    client.timing('postReviews_response', resEnd);
  })
};

exports.updateHelpful = (req, res) => {
  const resStart = new Date();
  client.increment('updateHelpful');

  const dbStart = new Date();
  models.updateHelpful(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('postReviews_db', dbEnd);
      res.status(201).send(data);
    }
    const resEnd = new Date() - resStart;
    client.timing('updateHelpful_response', resEnd);
  })
};

exports.updateReport = (req, res) => {
  const resStart = new Date();
  client.increment('updateReport');

  const dbStart = new Date();
  models.updateReport(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    } else {
      const dbEnd = new Date() - dbStart;
      client.timing('postReviews_db', dbEnd);
      res.status(201).send(data);
    }
    const resEnd = new Date() - resStart;
    client.timing('updateReport_response', resEnd);
  })
};

exports.client = client;