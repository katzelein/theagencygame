'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Message = db.define('messages', {
  sid: Sequelize.STRING,
  type: Sequelize.ENUM('call', 'text'),
  recordingUrl: Sequelize.STRING,
  recordingDuration: Sequelize.INTEGER
})

module.exports = Message



