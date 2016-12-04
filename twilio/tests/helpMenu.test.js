const chai = require('chai');
const expect = chai.expect;

const db = require('../../models/index')
const User = require('../../models/user')

const {fetchMessage} = require('../lookup')

describe('Help Menu', () => {

	describe('help', () => {
		let miracleUser, returnObj

		before ('create user, input user and message into fetchMessage', () => {
			return User.create({
				username: 'Jesus',
				messageState: 'QUERY_MISSION',
				status: 'standby'
			})
			.then(newUser => {
				miracleUser = newUser;
				const message = {Body: 'help'}
				returnObj = fetchMessage(miracleUser, message)
			})
		})

		// beforeEach('fetch fresh copy of user')

		it('returns the help menu options regardless of messageState', () => {
			expect(returnObj).to.be.equal("You have reached The Agency\'s automated help menu! Text 'tutorial' to redo the training mission.  Text 'quit' to quit any ongoing mission.  Text 'skip' to skip any particular challenge in a mission. Text 'resign' to retire from The Agency.")
		})
		it('does not touch messageState', () => {
			return User.findById(miracleUser.id)
			.then(foundUser => {
				expect(foundUser.status).to.be.equal('standby')
				expect(foundUser.messageState).to.be.equal('QUERY_MISSION')
			})
		})
	})

	describe('tutorial', () => {
		it('allows user to redo the training mission')
		it('only continues to tutorial if user is on standby', () => {
			
		})
		it('returns some sort of error message if user is not on standby')
	})

	describe('quit', () => {
		it('allows user to quit a mission')
		it('returns some sort of error message if user is not on a mission')
		it('sets user to standby ')
	})


	describe ('QUERY_QUIT_MISSION', () => {
		describe('state is reached by texting in \'quit\'', () => {
			it ('should send back error message if user texts quit when not on a mission', () => {
				
			})
		})
	})


})

