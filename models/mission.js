'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Mission = db.define('missions', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  location: Sequelize.STRING,
  latitude: {
  	type: Sequelize.FLOAT,
  	defaultValue: 0
  },
  longitude: {
  	type: Sequelize.FLOAT,
  	defaultValue: 0
  },
})

module.exports = Mission




