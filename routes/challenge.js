var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
const {mustBeAdmin, mustBeLoggedIn, selfOnly} = require('./permissions')

router.post('/setMission/:missionId', function(req, res, next){
	console.log("posting challenge mission specific")
	if(mustBeAdmin()(req, res, next) === "continue"){
	let {objective, summary, targetTags, targetText, conclusion, category, order} = req.body
	Challenge.create({
		objective, summary, targetTags, targetText, conclusion, category, order
	})
	.then(challenge => {
		return challenge.setMission(req.params.missionId)
		.then((challenge) => {
			Mission.findOne({
				where: {id: req.params.missionId},
				include: [
     				{ model: Challenge, order: order}
  				]
			})
			.then(mission => {
				mission.increment('numChallenges')
				.then((mission) => {
					console.log("NUM CHALLENGES: ", mission.numChallenges)
					challenge.update({order: mission.numChallenges})
					.then(() => {
						let missionChallenges = mission.challenges
						console.log("MISSION CHALLENGES: ", missionChallenges)
						console.log("SECOND TO LAST CHALLENGES S: ", missionChallenges[missionChallenges.length - 2])
						missionChallenges[missionChallenges.length - 2].update({
							hasNext: true
						})
					})
				})
			})
		})
		.then(() => res.status(201).json(challenge))
	})
	.catch(next)
}
})

router.post('/', function(req, res, next){
	console.log("posting challenge")
	if(mustBeAdmin()(req, res, next) === "continue"){
	let {objective, summary, targetTags, targetText, conclusion, category, order} = req.body
	Challenge.create({
		objective, summary, targetTags, targetText, conclusion, category, order
	})
	.then(challenge => {
		res.status(201).json(challenge)
	})
	.catch(next)
}
})

router.put('/:id/update', function(req, res, next){
	let {missionId, objective, summary, targetTags, targetText, conclusion, category, order} = req.body
	//missionId = parseInt(missionId)
	order = parseInt(order)
	console.log("IS MISSION NULL? : type ", typeof missionId, " val ", missionId)
	if(mustBeAdmin()(req, res, next) === "continue"){
	Challenge.findById(req.params.id)
	.then(challenge => {
		if(challenge){
		return challenge.getMission()
		.then(mission => {
			let prevMission = mission ? mission.id : null
			//if(prevMission === missionId){
				console.log("MISSION WAS UNCHANGED")
				challenge.update({
					missionId, objective, summary, targetTags, targetText, conclusion, category, order
				})
				
		})
	}
	})
	.then(challenge => res.status(200).json(challenge))
	}
})

router.put('/:id/addToMission/:missionId', function(req, res, next){
	if(mustBeAdmin()(req, res, next) === "continue"){
	Mission.findById(req.params.missionId)
	.then(mission => {
		console.log("FOUND MISSION")
		mission.addChallenge(req.params.id)
		.then(() => {
			console.log("INCREMENTING NUM CHALLENGES")
			return mission.increment('numChallenges')
		})
		.then((newMission) => res.status(200).json(newMission))
	})
}
})

// delete challenge from mission but not from database
router.delete('/:id/mission/:missionId', function(req, res, next){
	if(mustBeAdmin()(req, res, next) === "continue"){
	Challenge.findById(req.params.id)
	.then((challenge) => {
		Mission.findById(req.params.missionId)
		.then(mission => {
			mission.removeChallenge(challenge.id)
		
			.then(() => {
				console.log("MISSION after remove challenge: ", mission)
				mission.decrement('numChallenges')
				.then((mission) => {
					console.log("MISSION IN DELETE: ", mission)
					updateHasNext(mission)
					.then(() => challenge.getUsers())
					.then(() => {
						res.status(200).json(mission)
					})
				})
	})})})}})

// delete challenge from database
router.delete('/:id', function(req, res, next){
	if(mustBeAdmin()(req, res, next) === "continue"){
	Challenge.findById(req.params.id)
	.then((challenge) => {
		challenge.getUsers()
		.then(() => {
			console.log("DON'T FORGET TO ALERT USERS")
			return challenge.destroy({force: true})
		})
		.then(() => res.sendStatus(200))
	})
}
})

function updateHasNext(mission){
	console.log("IN UPDATE HAS NEXT")
	let numChallenges = mission.numChallenges
	console.log("NUM CHALLENGES: ", numChallenges)
	return Challenge.update({
			hasNext: true
		},
		{ where: {
			missionId: mission.id,
			order: {$lt: numChallenges}
		}
	})
	.then(() => {
		return Challenge.update({
			hasNext: false},
			{where: {
				missionId: mission.id,
				order: numChallenges
			}
	})})


	// mission.getChallenges({where: {
	// 	order: {$lt: numChallenges}
	// }})
	// .then(challenges => {
	// 	if(challenges.length){

	// 	}
	// })

}

module.exports = router;

