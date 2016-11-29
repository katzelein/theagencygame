var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
const {mustBeAdmin, mustBeLoggedIn, selfOnly} = require('./permissions')

router.get('/:id', function(req, res, next){
	console.log("Req: ", req.session)
	console.log("getting user")
	selfOnly("view")(req, res, next)
	User.findById(req.params.id)
	.then(user => {
		res.status(200).json(user)
	})
	.catch(next)
})

router.get('/exists/:number', function(req, res, next){
	console.log("Req: ", req.session)
	console.log("getting user")
	User.findOne({
		where: { phoneNumber: req.params.number}
	})
	.then(user => {
		if(user) res.status(200).json({found: true})
		else res.json({found: false})
	})
	.catch(next)
})

module.exports = router;