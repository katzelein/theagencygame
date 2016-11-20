'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Mission = db.define('missions', {
  title: Sequelize.STRING,
  summary: Sequelize.TEXT,
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT
})

module.exports = Mission




