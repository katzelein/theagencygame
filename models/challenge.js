'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Challenge = db.define('challenges', {
  objective: Sequelize.STRING,
  summary: Sequelize.STRING,
  latitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 }
  },
  borough: Sequelize.ENUM('Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island'),
  imgTagsExpected: Sequelize.ARRAY(Sequelize.TEXT),
  textExpected: Sequelize.TEXT
})

module.exports = Challenge
