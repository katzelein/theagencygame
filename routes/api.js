var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var User = require('../models/user')
var Mission = require('../models/mission')
var Challenge = require('../models/challenge')
const {mustBeAdmin, mustBeLoggedIn, selfOnly} = require('./permissions')


router.get('/whoami', (req, res, next) => {
	if(req.session && req.session.user){
	  	res.status(200).json(req.session.user)
	}
	else res.status(404).send('No user associated with this session.')
})

router.get('/missions', function(req, res, next){
	console.log("getting missions")
	mustBeAdmin()(req, res, next)
	Mission.findAll({
		include: [
     		{ model: Challenge }
  		],

  		order: 'id'
	})
	.then(missions => {
		res.status(200).json(missions)
	})
	.catch(next)
})

router.get('/challenges', function(req, res, next){
	console.log("getting challenges")
	mustBeAdmin()(req, res, next)
	Challenge.findAll({
		include: [
     		{ model: Mission}
  		],

  		order: 'id'
	})
	.then(challenges => {
		res.status(200).json(challenges)
	})
	.catch(next)

})

router.get('/users', function(req, res, next){
	mustBeAdmin()(req, res, next)
	User.findAll({
  		order: 'id'
	})
	.then(users => {
		res.status(200).json(users)
	})
	.catch(next)

})


router.post('/logout', function(req, res, next){
	req.session.user = null;
	res.sendStatus(200)
})

router.use('/challenge', require('./challenge'))
router.use('/user', require('./user'))
router.use('/mission', require('./mission'))


module.exports = router;

