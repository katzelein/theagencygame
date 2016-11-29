const {expect} = require('chai');

const {getChallenge, chooseMission} = require('./chooser')
const db = require('../models/index')
const Mission = require('../models/mission');
const Challenge = require('../models/challenge');

describe('Game Logic', () => {
	
	before ('create mission and challenges', () => {
	})
	
	describe('getChallenge', () => {
		it('should fetch first challenge', () => {

			let ch = getChallenge(missionId);

			return ch
			.then(result => {
				challengeId = result.id

				expect(result.order).to.be.equal(1);
			})
		})

		it('should fetch next challenge', () => {

			let ch = getChallenge(missionId, challengeId);

			return ch
			.then(result => {
				challengeId = result.id

				expect(result.order).to.be.equal(2);
			})
		})

		it ('should return null if there are no more challenges', () => {

			let ch = getChallenge(missionId, challengeId);

			return ch
			.then(result => {
				expect(result).to.be.null
			})
		})
	})

	xdescribe('chooseMission', () => {
		it ('should choose mission based on location', () => {
			let m = chooseMission(/*coordinates of mission*/)

			return m
			.then(result => {
				expect(result.id).to.be.equal(missionId)
			})
		})

		it ('should choose closest mission, if coordinates do not match', () => {
			let m;

			return Mission.create({
				title: 'Mission far away',
				description: 'mission that should not be chosen',
				location: /*coordinates far away*/ null,
				place: 'far far away',
				numChallenges: 0
			})
			.then(newM => {
				m = newM;
				return chooseMission(/*coordinates closer to missionId than m*/)
			})
			.then(result => {
				expect(result.id).to.not.be.equal(m.id)
			})
		})

		it ('should choose mission within 5 miles', () => {
			return chooseMission(/*coordinates within 5 miles of missionId*/)
			.then(result => {
				expect(result.id).to.be.equal(missionId)
			})
		})

		it ('should be able to choose mission based on labelled place', () => {
			return chooseMission(null, 'here')
			.then(result => {
				expect(result.id).to.be.equal(missionId);
			})
		})
	})
}) 
