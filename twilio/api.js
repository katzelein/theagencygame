var twilioAPI = require('express').Router()
var twilio = require('twilio')
var rp = require('request-promise');
//const credentials = require('../key')
var geocoder = require('geocoder');
var db = require('../models');
var User = require('../models/user');

twilioAPI.get('/')

twilioAPI.post('/messages', function(req, res, next){
  //console.log("Hey this is a message")
  console.log("REQ BODY: ", req.body)
  console.log("MEDIA TYPE: ", req.body.MediaContentType0)
  console.log("MEDIA URL: ", req.body.MediaUrl0)

  User.findOne({
  	where: {
  		phoneNumber: req.body.From
  	}
  })
  .then(user => {
  	console.log("found user: ", user)
  	if(user){
  		console.log("first res: ", res)
  		if(user.lastMessage === "join"){
  			console.log("last message what join")
  			if((/(join)/i).test(req.body.Body)){
  				console.log("IT FOUND JOIN")
  				user.update({
					lastMessage: "name"
				})
				.then(user => {
					console.log("user updated: ", user)
					var twiml = new twilio.TwimlResponse();
    				twiml.message(function() {
						this.body('Welcome to The Agency, new recruit. This is a trial run, you will have to prove yourself. For now though, what shall we call you?');
					});
					res.writeHead(200, {'Content-Type': 'text/xml'})
					res.end(twiml.toString())
				})	
  			}
		}
		else if(user.lastMessage === "name"){
			// have a timeout in case they do not respond and then text a day later and forgot they were supposed to provide their name
			// maybe get message ssid before it is sent
			user.update({
				name: req.body.Body,
				lastMessage: "confirmName"
			})
			.then(user => {
					console.log("user updated: ", user)
					var twiml = new twilio.TwimlResponse();
    				twiml.message(function() {
						this.body('Alright, you are now in our system as ' + req.body.Body);
					});
					res.writeHead(200, {'Content-Type': 'text/xml'})
					res.end(twiml.toString())
			})
		}
  

 
  
  		// if(user.name){
  		// 	var twiml = new twilio.TwimlResponse();
    // 		twiml.message(function() {
    //   			this.body("Welcome back, " + user.name + ". Are you ready for your next mission?");
    // 		});
    // 		res.writeHead(200, {'Content-Type': 'text/xml'})
    // 		res.end(twiml.toString())

    // 		//confirm this sent and then add it to database
  		// }
  		// else{
  		// 	var twiml = new twilio.TwimlResponse();
    // 		twiml.message(function() {
    //   			this.body("Welcome back, stranger. You have chosen to remain anonymous so far, but we cannot send you on any missions until you provide an agent name. What shall we call you?");
    // 		});
    // 		User.update({
    // 			lastMessage: "name"
    // 		})
    // 		.then(user => {
    // 			res.writeHead(200, {'Content-Type': 'text/xml'})
    // 			res.end(twiml.toString())
    // 		})
    // 		// res.writeHead(200, {'Content-Type': 'text/xml'})
    // 		// res.end(twiml.toString())
  		// }
  	}
  	else{
  		User.create({
  			phoneNumber: req.body.From,
  			lastMessage: "join"
  		})
  		.then(user => {
	  		var twiml = new twilio.TwimlResponse();
	    	twiml.message(function() {
	      		this.body("The Agency has no record of you in our system. Would you like to join our forces? If so, text 'join' ");
	    	});
	    	res.writeHead(200, {'Content-Type': 'text/xml'})
	    	res.end(twiml.toString())
	    })
  	}
  	})

 //  if((/(join)/i).test(req.body.Body)){
 //  	console.log("IT FOUND JOIN")
 //  	User.findOrCreate({
 //  		where: {
 //  			phoneNumber: req.body.From
 //  		}
 //  	})
 //  	.spread(function(user, created) {
 //  		console.log("USER: ", user)
 //  		console.log("User name: ", user.name)
 //  		console.log("User data name: ", user.dataValues.name)

 //  		if(created){
 //  			var twiml = new twilio.TwimlResponse();
 //    		twiml.message(function() {
	// 			this.body('Welcome to The Agency, new recruit. What shall we call you?');
	// 		});
	// 		res.writeHead(200, {'Content-Type': 'text/xml'})
	// 		res.end(twiml.toString())
	// 		// add last text to database
	// 	}
	// })
  

 //  }

  // looking for location send from iPhone
  if(req.body.MediaContentType0 === 'text/x-vcard'){
  	//if(req.body.NumMedia === "1"){
   	//var xhr = new XMLHttpRequest();
	// xhr.open('GET', "https://api.twilio.com/2010-04-01/Accounts/AC8b6aeccc3229dc3db665208f22c1e3c7/Messages/MM7c9a6a399c39cd8c92147475b61115c5/Media/MEceda61786a02687157b6be4a83f8b1f1", true);
	// xhr.send();

	rp(req.body.MediaUrl0)
    .then(function (htmlString) {
        console.log("htmlString: ",  htmlString)
        var locStart = htmlString.indexOf("ll=") + 3
        var locFinish = htmlString.indexOf("&q=")
        var location = htmlString.slice(locStart, locFinish)
        console.log("location match: ", location)
        var reg = new RegExp("\\\\","g")
        location = location.replace(reg, "/")
        var LL = location.split("/,")
        console.log("LL: ", LL)

    })
    .catch(function (err) {
        // Crawling failed...
        console.log("ERR: ", err)
    });
  }
  // looking for location sent through body
  else if(req.body.Body.indexOf("maps.google.com") !== -1){
  
  	console.log("looking for location!!")
  	console.log("key: ", credentials.private_key_id)
 //  	var googleMapsClient = require('@google/maps').createClient({
 //  		key: credentials.private_key_id
	// });

  	var urlString = req.body.Body.replace(/["']/g, "")
  	var urlArray = urlString.split(/\r?\n/)
  	console.log("urlArray: ", urlArray)
  	var address = urlArray[2]
  	if(address.indexOf("http") !== -1){
  		address=address.slice(0, address.indexOf("http"))
  	}
  	//console.log("google key: ", googleKey)
  	console.log("ADDRESS: ", address)
  	// rp("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + credentials.private_key_id)
  	// .then(function(htmlString){
  	// 	console.log("location from API: ", htmlString)
  	// })

  	//console.log("google client: ", googleMapsClient.geocode)

 //  	googleMapsClient.geocode({
 //  		address: '1600 Amphitheatre Parkway, Mountain View, CA'
	// }, function(err, response) {
	// 	console.log("TESTING")
	// 	if(err) console.log("ERR: ", err)
 //  		if (!err) {
 //  			console.log("GOOGLE RESP: ", response.json)
 //    		console.log("GOOGLE RES: ", response.json.results);
 //  		}
	// });

	// googleMapsClient.directions({
	// 	origin: "75 9th Ave, New York, NY",
	// 	destination: "MetLife Stadium Dr East Rutherford, NJ 07073",
	// 	mode: "driving"
	// }, function(err, response) {
	// 	console.log("TESTING")
	// 	if(err) console.log("ERR: ", err)
 //  		if (!err) {
 //  			console.log("GOOGLE RESP: ", response.json)
 //    		console.log("GOOGLE RES: ", response.json.results);
 //    	}
 //  		})
 	var LL;
 	geocoder.geocode(address, function ( err, data ) {
  // do something with data 
  		LL = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
  		console.log("DATA: ", data)
  		console.log("RES: ", data.results)
  		console.log("RES TYPE: ", typeof data.results)
  		console.log("GEOM: ", data.results[0].geometry.location)
  		console.log("COMP: ", data.results[0])
  		console.log("LL: ", LL)
  		console.log("data type: ", typeof data)
	});

  	// address = address.replace(/\s/g, "+")
  	// address = address.replace(/,/g, "")
  	// console.log("ADDRESS REPLACE: ", address)
  }
  	// var twiml = new twilio.TwimlResponse();
   //  twiml.message(function() {
   //    this.body('The Robots are coming! Head for the hills!');
   //  });
   //  res.writeHead(200, {'Content-Type': 'text/xml'})
   //  res.end(twiml.toString())
});

module.exports = twilioAPI