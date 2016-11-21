var rp = require('request-promise');
//const credentials = require('../key')
var geocoder = require('geocoder');
const locationFailure = "We were unable to pinpoint your location, please try again or type 'help'"


function getLocation(message){
  var locationRes;
console.log("message inside getLocation: ", message)
console.log("message keys: ", Object.keys(message))
console.log("message body inside getLocation: ", message.Body)
  // *********** SENT WITH IPHONE *************
  if(message.MediaContentType0 === 'text/x-vcard'){

	return rp(message.MediaUrl0)
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
        return LL
        //locationRes = LL

    })
    .catch(function (err) {
        // Crawling failed...
        console.log("ERR: ", err)
    });
  }
 // ********** SENT WITH PHONE USING GOOGLE MAPS (ie google phone or android) **********
  else if(message.Body.indexOf("maps.google.com") !== -1){
  
  	console.log("looking for location!!")
  	var urlString = message.Body.replace(/["']/g, "")
  	//var urlArray = urlString.split(/\r?\n/)
    var urlArray = urlString.split("HELLO")
  	console.log("urlArray: ", urlArray)
  	var address = urlArray[2]
    console.log
  	if(address.indexOf("http") !== -1){
  		address=address.slice(0, address.indexOf("http"))
  	}
  	console.log("ADDRESS: ", address)

 	  var LL;

    return new Promise(function(resolve, reject) {
      geocoder.geocode(address, function (err, data) {
         if(err) reject(err);
         resolve(data);
      })
    })
    .then(data => {
      console.log("DATA STATUS: ", data.status)
      if(data.status === 'ZERO_RESULTS'){
        console.log("data status zero")
        return locationFailure
      }
  // do something with data 
      else{
        LL = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
        console.log("DATA: ", data)
        console.log("RES: ", data.results)
        console.log("RES TYPE: ", typeof data.results)
        console.log("GEOM: ", data.results[0].geometry.location)
        console.log("COMP: ", data.results[0])
        console.log("LL: ", LL)
        console.log("data type: ", typeof data)
        return LL
      //locationRes = LL
      }

    })
    .catch(err => console.log(err))


 // 	/*return*/ geocoder.geocode(address, function ( err, data ) {
 //    console.log("DATA STATUS: ", data.status)
 //    if(err || data.status === 'ZERO_RESULTS'){
 //      console.log("ERR: ", err)
 //      return locationFailure
 //    }
 //  // do something with data 
 //  else{
 //  		LL = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
 //  		console.log("DATA: ", data)
 //  		console.log("RES: ", data.results)
 //  		console.log("RES TYPE: ", typeof data.results)
 //  		console.log("GEOM: ", data.results[0].geometry.location)
 //  		console.log("COMP: ", data.results[0])
 //  		console.log("LL: ", LL)
 //  		console.log("data type: ", typeof data)
 //      return LL
 //      //locationRes = LL
 //    }
	// });	
  }


// ********** ADDRESS SENT DIRECTLY IN TEXT **********
   else if(message.Body){
    return new Promise(function(resolve, reject) {
        geocoder.geocode(message.Body, function (err, data) {
          if(err) reject(err);
          resolve(data);
        })
    })
    .then(data => {
      console.log("DATA STATUS: ", data.status)
        if(data.status === 'ZERO_RESULTS'){
          console.log("data status zero")
          return locationFailure
        }
      // do something with data 
        else{
          LL = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
          console.log("DATA: ", data)
          console.log("RES: ", data.results)
          console.log("RES TYPE: ", typeof data.results)
          console.log("GEOM: ", data.results[0].geometry.location)
          console.log("COMP: ", data.results[0])
          console.log("LL: ", LL)
          console.log("data type: ", typeof data)
          return LL
      //locationRes = LL
        } 
    })
    .catch(err => console.log(err))
  }

// ************ NO MESSAGE BODY OR V-CARD SENT
  else {
    return new Promise(function(resolve, reject){
      resolve(locationFailure)
    })
    .then(locationFailure => locationFailure)
  }

  //console.log("LOCATION RES: ", locationRes) 
  //return locationRes
}

module.exports = {getLocation}
