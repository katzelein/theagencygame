const {expect} = require('chai');
const {getPhotoTags} = require('../clarifai')
 
describe('Clarifai (success - don\'t overuse Clarifai in testing)', () => {

	let answer;

	before('get answer from getPhotoTags', () => {
		let message = {
			MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/ACc41e6487bcf3da0f8bdde627b28740d2/Messages/MMf83db10bb0caba9a75aeee2e3d8a5612/Media/ME217735d4d981bcb4ad9c314455319b82',
			MediaContentType0: 'image/jpeg', // steampunk sign
		}
		answer = getPhotoTags(message)
	})

	it ('should return a promise', () => {
		expect(answer.constructor.name).to.be.equal('Promise');
	})

	it ('returns a promise that should resolve to an array', () => {
		answer
		.then(result => {
			// console.log(result)
			expect(result).to.be.an('array')
		})
	})
})