'use strict'

const db = require('./_db')
const User = require('./user')
const {expect} = require('chai')

describe('User', () => {
  before('wait for the db', () => db.didSync)

  describe('validations', () => {
    let user;
    beforeEach('test challenge', () => {
      user = User.build({username: 'Agent Smith'});
    })

    it('has valid objective', () => {
      expect(user.username).to.be.a('string')
    })
  })
})
