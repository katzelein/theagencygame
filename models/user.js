'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('users', {
  name: Sequelize.STRING,
  phoneNumber: Sequelize.STRING
})

module.exports = User
