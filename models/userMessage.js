'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const UserMessages = db.define('userMessages', {
})

module.exports = UserMessages
