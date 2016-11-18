'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Mission = db.define('missions', {
  title: Sequelize.STRING,
  summary: Sequelize.TEXT
})

module.exports = Mission




