var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
const {mustBeAdmin, mustBeLoggedIn, selfOnly} = require('./permissions')

router.post('/setMission/:missionId', function(req, res, next){
	console.log("posting challenge")
	console.log("REQ BODY FROM FORM: ", req.body)
	//mustBeAdmin()(req, res, next)
	let {objective, summary, targetTags, targetText, conclusion, type, order} = req.body
	Challenge.create({
		objective, summary, targetTags, targetText, conclusion, type, order
	})
	.then(challenge => {
		return challenge.setMission(req.params.missionId)
		.then(() => {
			Mission.findById(req.params.missionId)
			.then(mission => {
				// mission.getChallenges()
				// .then(challenges => {
				// 	mission.update({
				// 		numChallenges: challenges.length
				// 	})
				// })
				mission.increment('numChallenges')
			})
		})
	})
	.then(challenge => res.status(200).json(challenge))
	.catch(next)
})

router.post('/', function(req, res, next){
	console.log("posting challenge")
	console.log("REQ BODY FROM FORM: ", req.body)
	//mustBeAdmin()(req, res, next)
	let {objective, summary, targetTags, targetText, conclusion, type, order} = req.body
	Challenge.create({
		objective, summary, targetTags, targetText, conclusion, type, order
	})
	.then(challenge => {
		res.status(200).json(challenge)
	})
	.catch(next)
})

router.put('/:id/update', function(req, res, next){
	let {missionId, objective, summary, targetTags, targetText, conclusion, type, order} = req.body
	//missionId = parseInt(missionId)
	console.log("IS MISSION NULL? : type ", typeof missionId, " val ", missionId)
	Challenge.findById(req.params.id)
	.then(challenge => {
		challenge.getMission()
		.then(mission => {
			console.log("MISSION BEFORE UPDATE: ", mission)
			let prevMission = mission ? mission.id : null
			console.log("PREV MISSION: ", prevMission, " type: ", typeof prevMission)
			console.log("NEW MISSION: ", missionId, " type ", typeof missionId)
			//if(prevMission === missionId){
				console.log("MISSION WAS UNCHANGED")
				challenge.update({
					missionId, objective, summary, targetTags, targetText, conclusion, type, order
				})
				.then(challenge => res.status(200).json(challenge))
			//}
			// else{ 
			// 	if(prevMission !== null){
			// 	console.log("MISSION WAS NULL BUT CHANGING")
			// 	// remove challenge from mission and decrement numChallenges
			// 	mission.removeChallenge(req.params.id)
			// 	.then(() => {
			// 		mission.decrement('numChallenges')
			// 	})

			// 	}
			// 	if(missionId !== null){
			// 	// add challenge to mission and increment numChallenges
			// 	}
			// 	res.sendStatus(200)
			// }
		})
	})
})

router.put('/:id/addToMission/:missionId', function(req, res, next){
	Mission.findById(req.params.missionId)
	.then(mission => {
		console.log("FOUND MISSION")
		mission.addChallenge(req.params.id)
		.then(() => {
			console.log("INCREMENTING NUM CHALLENGES")
			return mission.increment('numChallenges')
		})
		.then(() => res.sendStatus(200))
	})
})

// delete challenge from mission but not from database
router.delete('/:id/mission/:missionId', function(req, res, next){
	//mustBeAdmin()(req, res, next)
	Challenge.findById(req.params.id)
	.then((challenge) => {
		Mission.findById(req.params.missionId)
		.then(mission => {
			mission.removeChallenge(challenge.id)
		
		.then(() => {
			console.log("MISSION after remove challenge: ", mission)
			mission.decrement('numChallenges')
			.then(() => {
				challenge.getUsers()
				.then(() => {
					res.sendStatus(200)
				})
				
})
	})})})})

// delete challenge from database
router.delete('/:id', function(req, res, next){
	//mustBeAdmin()(req, res, next)
	Challenge.findById(req.params.id)
	.then((challenge) => {
		challenge.getUsers()
		.then(() => {
			console.log("DON'T FORGET TO ALERT USERS")
			// challenge.getMission()
			// .then(mission => {
			// 	mission.removeChallenge(challenge.id)
			// })
			return challenge.destroy({force: true})
		})
		.then(() => res.sendStatus(200))
	})
})

module.exports = router;