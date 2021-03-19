const router = require('express').Router();
const controllers = require('../controllers');

router.route('/meta')
  .get((req, res) => {
    controllers.getMeta(req,res);
  });

router.route('/')
  .get((req, res) => {
    controllers.getReviews(req, res);
  })
  .post((req, res) => {
    controllers.postReviews(req, res);
  });

router.route('/:review_id/helpful')
  .put((req, res) => {
    controllers.updateHelpful(req, res);
  });

router.route('/:review_id/report')
  .put((req, res) => {
    controllers.updateReport(req, res);
  });

module.exports = router;