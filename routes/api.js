var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
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


router.get('/user/:id/data', function(req, res, next){
	console.log("Req: ", req.session)
	console.log("getting user")
	selfOnly("view")(req, res, next)
	User.findById(req.params.id, {include: [
		{ 
			model: userMissions, 
			where: { 
				userId: req.params.id
			}
		}, {
			model: userChallenges,
			where: {
				userId: req.params.id
			} 
		}
	]})
		.then(data => {
			res.status(200).send(data)
		})
			.catch(next)
})


router.get('/user/exists/:number', function(req, res, next){
	console.log("Req: ", req.session)
	console.log("getting user")
	User.findOne({
		where: {
			phoneNumber: req.params.number
		}
	})
	.then(user => {
		if(user){
			res.status(200).json({found: true})
		}
		else{
			res.json({found: false})
		}

	})
	.catch(next)
})


router.post('/mission', function(req, res, next){
	console.log("posting mission")
	console.log("REQ BODY FROM FORM: ", req.body)
	//mustBeAdmin()(req, res, next)
	let {title, description, place, location} = req.body
	Mission.create({
		title, description, place, location, 
		numChallenges: 0
	})
	.then(mission => {
		res.status(200).json(mission)
	})
	.catch(next)
})

router.get('/missions', function(req, res, next){
	console.log("getting missions")
	//mustBeAdmin()(req, res, next)
	Mission.findAll({
		include: [
     		{ model: Challenge }
  		],

  		order: 'id'
	})
	.then(missions => {
		//console.log("MISSIONS: ", missions)
		res.status(200).json(missions)
	})
	.catch(next)
})

router.put('/mission/:id/update', function(req, res, next){
	let {title, description, place, location} = req.body
	Mission.findById(req.params.id)
	.then(mission => {
		mission.update({
			title, description, place, location
		})
		.then(mission => res.status(200).json(mission))
	})
})

router.delete('/mission/:id', function(req, res, next){
	//mustBeAdmin()(req, res, next)
	Mission.findById(req.params.id)
	.then((mission) => {
		mission.getChallenges()
		.then(() => {
			console.log("DON'T FORGET TO UPDATE CHALLENGES")
			return mission.destroy({force: true})
		})
		.then(() => res.sendStatus(200))
	})
})

router.get('/challenges', function(req, res, next){
	console.log("getting challenges")
	//mustBeAdmin()(req, res, next)
	Challenge.findAll({
		include: [
     		{ model: Mission}
  		],

  		order: 'id'
	})
	.then(challenges => {
		//console.log("CHALLENGES: ", challenges)
		res.status(200).json(challenges)
	})
	.catch(next)

})

router.post('/challenge/setMission/:missionId', function(req, res, next){
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

router.post('/challenge', function(req, res, next){
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

router.put('/challenge/:id/update', function(req, res, next){
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

router.put('/challenge/:id/addToMission/:missionId', function(req, res, next){
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
router.delete('/challenge/:id/mission/:missionId', function(req, res, next){
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
router.delete('/challenge/:id', function(req, res, next){
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

router.post('/logout', function(req, res, next){
	req.session.user = null;
	res.sendStatus(200)
})


module.exports = router;

