var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
const {mustBeAdmin, mustBeLoggedIn, selfOnly} = require('./permissions')

router.post('/', function(req, res, next){
	console.log("posting mission")
	if(mustBeAdmin()(req, res, next) === "continue"){
		let {title, description, place, meetingPlace, location} = req.body
		Mission.create({
			title, description, place, meetingPlace, location, 
			numChallenges: 0
		})
		.then(mission => {
			res.status(200).json(mission)
		})
		.catch(next)
	}
})


router.put('/:id/update', function(req, res, next){
	let {title, description, place, meetingPlace, location} = req.body
	if(mustBeAdmin()(req, res, next) === "continue"){
		Mission.findById(req.params.id)
		.then(mission => {
			mission.update({
				title, description, place, meetingPlace, location
			})
			.then(mission => res.status(200).json(mission))
		})
	}
})

router.delete('/:id', function(req, res, next){
	if(mustBeAdmin()(req, res, next) === "continue"){
		Mission.findById(req.params.id)
		.then((mission) => {
			mission.getChallenges()
			.then(() => {
				console.log("DON'T FORGET TO UPDATE CHALLENGES")
				return mission.destroy({force: true})
			})
			.then(() => res.sendStatus(200))
		})
	}
})

module.exports = router;