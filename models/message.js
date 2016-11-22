'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Message = db.define('messages', {
  recordingSid: Sequelize.STRING,
  type: Sequelize.ENUM('call', 'text'),
  recordingUrl: Sequelize.STRING
})

module.exports = Message



