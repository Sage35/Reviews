const router = require('express').Router();
const controllers = require('../controllers');

router.route('/meta')
  .get((req, res) => {
    var resStart = new Date();
    controllers.getMeta(req,res);
  });

router.route('/')
  .get((req, res) => {
    var resStart = new Date();
    controllers.getReviews(req, res);
  })
  .post((req, res) => {
    var resStart = new Date();
    controllers.postReviews(req, res);
  });

router.route('/:review_id/helpful')
  .put((req, res) => {
    var resStart = new Date();
    controllers.updateHelpful(req, res);
  });

router.route('/:review_id/report')
  .put((req, res) => {
    var resStart = new Date();
    controllers.updateReport(req, res);
  });

module.exports = router;