'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Mission = db.define('missions', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  place: Sequelize.STRING,
  location: {
  	type: Sequelize.GEOMETRY
  },
  numChallenges: Sequelize.INTEGER
})

module.exports = Mission




