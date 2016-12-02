'use strict'
const sequelize = require('sequelize')
const Mission = require('../models/mission');
const Challenge = require('../models/challenge');
const db = require('../models')
const User = db.models.users
const UserMission = db.models.userMissions

const adventureDetails = (location, solo) => {
	console.log("location in ADVENTURE DETAILS: ", location)
	
	if(solo) return missionChooser(location.coordinates)
		// in the case that the partner shares same uncompleted mission
	else return Promise.all([partnerChooser(location.coordinates), missionChooser(location.coordinates)])
	
}


const partnerChooser = (userId, coordinates) => {
// 	db.query("SELECT * FROM users WHERE ST_DWithin(user.location, 'POINT(1000 1000)', 100.0)", 
// 		{ type: sequelize.QueryTypes.SELECT }).then(function (results) {

// 			console.log("RESULTS: ", results)
// })
console.log("COORDINATES: ", coordinates)
let coordString = `POINT(${coordinates[0]} ${coordinates[1]})`
return User.findAll({
	where: sequelize.and(
		sequelize.where(sequelize.fn(
			'ST_DWithin',
			sequelize.col('users.location'), sequelize.fn('ST_GeographyFromText', `SRID=4326;${coordString}`), 2000), true
		),
		//sequelize.where(sequelize.col('users.status'), 'ready')
		{status: 'ready'},
		{id: {$ne: userId}}
		),
	include: [{
		model: UserMission,
		attributes:['missionId']}],
	order: [['readyAt', 'ASC']]	
})
// .then(res => {console.log("RES: ", res)
// 	console.log("OPERAGIRL MISSIONS: ", res[0].userMissions)
// })
.catch(err => console.log(err))
}

const missionChooser = (user, coordinates) => {
	// filter all missions based on location
	// randomly choose a mission


	// can also fetch mission based on labelled place
	// set default to return Grace Hopper mission
	// if (!place) place = "Grace Hopper"; 
	return Mission.findOne({where: {place: 'Grace Hopper'}})

	let coordString = `POINT(${coordinates[0]} ${coordinates[1]})`
	return user.getMissions()
	.then(missions => {
		let missionIds = missions.map(function(i){
			return i.id
		})
		console.log("MISSION IDS: ", missionIds)
		return Mission.findAll({
			where: sequelize.and(
				sequelize.where(sequelize.fn(
					'ST_DWithin',
					sequelize.col('missions.location'), sequelize.fn('ST_GeographyFromText', `SRID=4326;${coordString}`), 2000), true
				),
			//sequelize.where(sequelize.col('users.status'), 'ready')
			{id: {$notIn: missionIds}}
			)
		})
		//.then(res => console.log("RES: ", res))
		.catch(err => console.log(err))	

	})
}

//console.log("PARTNER CHOOSER: ", partnerChooser([40, 70]))

module.exports = {adventureDetails, missionChooser, partnerChooser}

// return Neighborhood.findById(id).then(neighborhood => {
//   return neighborhood.getAddress().then(address => {
//     return Address.findAll({
//       where: sequelize.where(
//         sequelize.fn(
//           'ST_DWithin',
//           sequelize.fn(
//             'ST_Transform',
//             address.position,
//             26986),
//           sequelize.fn('ST_Transform',
//             sequelize.col('position'),
//             26986),
//           distance),
//         true
//       )
//     })
//   })
// }).catch(err => new Error(err));

// console.log("MISSION CHOOSER TEST: ", User.findById(5)
// .then(user => {
// 	return missionChooser(user, user.location.coordinates)
// }))

// console.log("PARTNER CHOOSER TEST: ", User.findById(6)
// .then(user => {
// 	return partnerChooser(user.id, user.location.coordinates)
// }))
