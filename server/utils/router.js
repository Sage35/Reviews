const router = require('express').Router();
const controllers = require('../controllers');

router.route('/meta')
  .get((req, res) => {

  });

router.route('/')
  .get((req, res) => {
    controllers.getReviews(req, res);
  })
  .post((req, res) => {

  });

router.route('/:review_id/helpful')
  .put((req, res) => {

  });

router.route('/:review_id/helpful')
  .put((req, res) => {

  });

module.exports = router;