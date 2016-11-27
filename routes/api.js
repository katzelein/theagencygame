var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
const {mustBeAdmin, mustBeLoggedIn, selfOnly} = require('./permissions')

// router.get('/', function (req, res, next) {
//   res.send("I'm working!")
// })

router.get('/whoami', (req, res, next) => {
	if(req.session && req.session.user){
		console.log("REQUEST IN /whoami: ", req.session.user.username)
	  	res.send(req.session.user)
	}
	else res.send({})
})


router.get('/user/:id', function(req, res, next){
	console.log("Req: ", req.session)
	console.log("getting user")
	selfOnly("view")(req, res, next)
	User.findById(req.params.id)
	.then(user => {
		res.status(200).json(user)
	})
	.catch(next)
})


router.post('/mission', function(req, res, next){
	console.log("posting mission")
	mustBeAdmin()(req, res, next)
	Mission.create({
		title: req.body.title
	})
	.then(mission => {
		res.status(200).json(mission)
	})
	.catch(next)
})

router.post('/logout', function(req, res, next){
	req.session.user = null;
	res.sendStatus(200)
})

module.exports = router;