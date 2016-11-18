'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Challenge = db.define('challenges', {
  objective: Sequelize.STRING,
  summary: Sequelize.STRING,
  latitude: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: { min: -180, max: 180 }
  },
  targetImgTags: Sequelize.ARRAY(Sequelize.TEXT),
  targetText: Sequelize.TEXT,
  conclusion: Sequelize.TEXT
})

module.exports = Challenge



