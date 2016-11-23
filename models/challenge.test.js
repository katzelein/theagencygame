'use strict'

const db = require('./_db')
const Challenge = require('./challenge')
const {expect} = require('chai')

describe('Challenge', () => {
  before('wait for the db', () => db.didSync)

  describe('validations', () => {
    let challenge;
    beforeEach('test challenge', () => {
      challenge = Challenge.build({objective: "This is the objective"});
    })

    it("has valid objective", () => {
      expect(challenge.objective).to.be.a('string')
    })


  })
})
