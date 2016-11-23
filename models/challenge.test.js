'use strict'

const db = require('./_db')
const Challenge = require('./challenge')
const {expect} = require('chai')

describe('Challenge', () => {
  before('wait for the db', () => db.didSync)

  describe('validations', () => {
    let nullChallenge;
    let validChallenge;
    beforeEach('test challenge', () => {
      nullChallenge = Challenge.build();
      validChallenge = Challenge.build({objective: "an objective"})
    })

    it("has a required objective field", () => {
      return nullChallenge.validate()
        .then(err => {
          expect(err).to.be.an('object');
          expect(err.errors[0]).to.contain({
            path: 'objective',
            type: 'notNull Violation'
          })
        })
    })

    it("has valid objective", () => {
      expect(validChallenge.objective).to.be.a('string')
    })
  })
})
