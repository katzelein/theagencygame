'use strict'
//const appEnv = require('../')
const appEnv = typeof global.it === 'function'
const test = true
console.log('appEnv: ', appEnv)
// console.log('isTesting: ', appEnv.isTesting)
const name = appEnv ? 'theagencytest' : 'theagency'
const url = process.env.DATABASE_URL || `postgres://localhost:5432/${name}`
var Sequelize = require('sequelize');

var db = new Sequelize(url, {
  logging: false
});



module.exports = db;

//require('./')
