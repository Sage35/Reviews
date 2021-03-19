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
  models.getMeta((err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
};

exports.postReviews = (req, res) => {
  models.postReviews((err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
};

exports.updateHelpful = (req, res) => {
  models.updateHelpful((err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
};

exports.updateReport = (req, res) => {
  models.updateReport((err, data) => {
    if (err) {
      console.error('error posting reviews: ', err);
      res.sendStatus(500);
    }
    res.status(200).send(data);
  })
};

