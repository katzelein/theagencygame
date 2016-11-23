var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')

// router.get('/', function (req, res, next) {
//   res.send("I'm working!")
// })

router.get('/user/:number', function(req, res, next){
	console.log("getting user")
	User.findOne({
		where: {
			phoneNumber: req.params.number
		}
	})
	.then(user => {
		res.status(200).json(user)
	})
	.catch(next)
})


router.post('/mission', function(req, res, next){
	console.log("posting mission")
	Mission.create({
		title: req.body.title
	})
	.then(mission => {
		res.status(200).json(mission)
	})
	.catch(next)
})

module.exports = router;
