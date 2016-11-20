'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Challenge = db.define('challenges', {
  objective: Sequelize.STRING,
  summary: Sequelize.TEXT,
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
  targetTags: Sequelize.ARRAY(Sequelize.STRING),
  targetText: Sequelize.TEXT,
  conclusion: Sequelize.TEXT,
  type: Sequelize.ENUM('text', 'image', 'voice')
})

module.exports = Challenge



