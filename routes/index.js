var express = require('express');
var router = express.Router();
var twilio = require('twilio');

// router.get('/', function (req, res, next) {
//   res.send("I'm working!")
// })

router.use('/voice', require('../twilio/voice').twilioAPI)
router.use('/twilio', require('../twilio/api'))
router.use('/authy', require('./authy'))

router.use('/api', require('./api'))

module.exports = router;
