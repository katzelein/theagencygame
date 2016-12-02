const {expect} = require('chai');

const {checkWatsonPromise} = require('../watson');

describe('checkWatsonPromise (mostly successful - don\'t overuse watson)', () => {
	it('should be a function (but it isn\'t????)', () => {
		expect(typeof checkWatsonPromise).to.be.equal('function');
		console.log(checkWatsonPromise)
	})

	it('should return a promise', () => {
		let message = {RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"}
		let answer = checkWatsonPromise(message);
		expect(answer.constructor.name).to.be.equal('Promise')
	})

	it('should work even wrapped in another function', () => {
		let wrapper = function(body) {
			let answer = checkWatsonPromise(message);
			return answer;
		}
		
		let message = {RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"}
		
		let returned = wrapper(message);
		
		console.log('returned',returned)

		return Promise.resolve(returned)
		.then(result=> {
			console.log('result', result)
		})
	})

	it('should work even wrapped in another function', () => {
		let wrapperobject = {
			wrapper: function(body) {
				let answer = checkWatsonPromise(message);
				return answer;
			}
		}
		
		let message = {RecordingUrl: "https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Recordings/RE75eed5e89a494ce14683e246b38a3928"}
		
		let returned = wrapperobject.wrapper(message);
		
		console.log('returned',returned)

		return Promise.resolve(returned)
		.then(result=> {
			console.log('result', result)
		})
	})
})