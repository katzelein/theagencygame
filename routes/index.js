var express = require('express');
var router = express.Router();
var twilio = require('twilio');

router.get('/', function (req, res, next) {
  res.send("I'm working on Rachael's machine!!!")
})

router.use('/twilio', require('../twilio/api'))

module.exports = router;
