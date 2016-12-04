'use strict'

const appEnv = typeof global.it === 'function'
const test = true
const name = appEnv ? 'theagencytest' : 'theagency'
const url = process.env.DATABASE_URL || `postgres://localhost:5432/${name}`
var Sequelize = require('sequelize');

var db = new Sequelize(url, {
  logging: false,
  native: true
});


module.exports = db;
