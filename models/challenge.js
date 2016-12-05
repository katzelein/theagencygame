'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Challenge = db.define('challenges', {
  objective: Sequelize.STRING,
  summary: Sequelize.TEXT,
  targetTags: Sequelize.ARRAY(Sequelize.STRING),
  targetText: Sequelize.TEXT,
  conclusion: Sequelize.TEXT,
  category: Sequelize.ENUM('text', 'image', 'voice'),
  order: Sequelize.INTEGER,
  hasNext: Sequelize.BOOLEAN
}, {
  hooks: {
    beforeDestroy: function(challenge, options) {
      challenge.getMission()
        .then(mission => {
          console.log("MISSION BEFORE DESTORY: ", mission)
          if (mission) {
            mission.removeChallenge(challenge.id)
              .then(() => {
                mission.decrement("numChallenges")
                  .then(() => console.log("UPDATED MISSION BEFORE DESTROY"))
              })
          } else {
            console.log("NO MISSION")
          }
        })
    }
  }
})

module.exports = Challenge
