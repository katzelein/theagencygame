const db = require('./models')
const {expect} = require('chai')
const Promise = require('bluebird');
const seed = require('./models/seed')

//console.log("SEED: ", seed)


  describe('Initialize db before tests', () => {
	
  before('Before running any tests, seed db', () => seed())

  describe('seeds database: ', () => {
  	const User = db.models.users
	const Challenge = db.models.challenges
	const Mission = db.models.missions
	const UserMission = db.models.userMissions
	const UserChallenge = db.models.userChallenges
    it('has missions', () =>
      Mission.findAll()
      .then(missions => {
      	return expect(missions.length).to.equal(3)
      })
      .catch(err => console.log(err))
    )

	})
})



