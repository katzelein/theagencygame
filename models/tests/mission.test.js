'use strict'

const db = require('../_db')
const Mission = require('../mission')
const {expect} = require('chai')

describe('Mission', () => {
  before('wait for the db', () => db.didSync)

  describe('validations', () => {
    let mission;
    beforeEach('test challenge', () => {
      mission = Mission.build({title: "Mission title"});
    })

    it("has valid objective", () => {
      expect(mission.title).to.be.a('string')
    })
  })
})
