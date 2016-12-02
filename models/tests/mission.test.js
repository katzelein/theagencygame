'use strict'

const db = require('../_db')
const Mission = require('../mission')
const { expect } = require('chai')

describe('Mission', () => {
  before('wait for the db', () => db.sync)

  describe('validations', () => {
    let mission;
    beforeEach('test mission', () => {
      mission = Mission.build({ title: "Mission title" });
    })

    it("has valid title", () => {
      expect(mission.title).to.be.a('string')
    })
  })
})
