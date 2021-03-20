const models = require('../models');

exports.getReviews = (req, res) => {
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
  models.postReviews(req.body, (err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
};

exports.updateHelpful = (req, res) => {
  models.updateHelpful(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
};

exports.updateReport = (req, res) => {
  models.updateReport(req.params.review_id, (err, data) => {
    if (err) {
      console.error('error updating reviews: ', err);
      res.sendStatus(500);
    }
    res.status(201).send(data);
  })
};

