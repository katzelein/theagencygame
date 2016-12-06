var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
var UserMission = require('../models/userMission')
var UserChallenge = require('../models/userChallenge')
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
  	console.log("This is the number we're searching for: [" + req.params.number + "]")
	User.findOne({
		where: { phoneNumber: req.params.number}
	})
	.then(user => {
    console.log("This is the user we're getting back: ", user)
		if(user) res.status(200).json({found: true})
		else res.json({found: false})
	})
	.catch(next)
})

router.get('/:id/history', function(req, res, next){
	let user_challenges;
	UserChallenge.findAll({
		where: {
			userId: req.params.id,
		},
		attributes:['challengeId']
	})
	.then(challenges => {
		user_challenges = challenges.map(function(i){
			return i.challengeId
		})
	return UserMission.findAll({
		where: {
			userId: req.params.id
		}, 
		include: [
     		{ model: Mission,
     		include: [
     			{model: Challenge,
     				where: {
     					id:  {$in: user_challenges}
     				}
     		}] 
     		}
  		]
  	})
  	})
  	.then(resp => {
  		res.json(resp)
	})
})

module.exports = router;