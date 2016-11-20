var rp = require('request-promise');
//const credentials = require('../key')
var geocoder = require('geocoder');
const locationFailure = "We were unable to pinpoint your location, please try again or type 'help'"


function getLocation(message){
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

    })
    .catch(function (err) {
        // Crawling failed...
        console.log("ERR: ", err)
    });
  }
  // looking for location sent through body
  else if(message.Body.indexOf("maps.google.com") !== -1){
  
  	console.log("looking for location!!")
  	var urlString = message.Body.replace(/["']/g, "")
  	var urlArray = urlString.split(/\r?\n/)
  	console.log("urlArray: ", urlArray)
  	var address = urlArray[2]
  	if(address.indexOf("http") !== -1){
  		address=address.slice(0, address.indexOf("http"))
  	}
  	console.log("ADDRESS: ", address)

 	var LL;
 	return geocoder.geocode(address, function ( err, data ) {
    if(err || data.status === 'ZERO_RESULTS'){
      console.log("ERR: ", err)
      return locationFailure
    }
  // do something with data 
  		LL = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
  		console.log("DATA: ", data)
  		console.log("RES: ", data.results)
  		console.log("RES TYPE: ", typeof data.results)
  		console.log("GEOM: ", data.results[0].geometry.location)
  		console.log("COMP: ", data.results[0])
  		console.log("LL: ", LL)
  		console.log("data type: ", typeof data)
      return LL
	});

  	
  }

  else if(message.Body){
    return geocoder.geocode(message.Body, function ( err, data ) {
      console.log("DATA: ", data.status)
      console.log("status type: ", typeof data.status)
      console.log("status length: ", data.status.length)
      console.log("1: ", data.status === 'ZERO_RESULTS')
      console.log("2: ", data.status === "ZERO_RESULTS")
      console.log("3: ", data.status == "ZERO_RESULTS")
      console.log("4: ", data.status == 'ZERO_RESULTS')
      console.log("ERR: ", err)
      if(err || (data.status === 'ZERO_RESULTS')){
        console.log("ERR: ", err)
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
      }
    });
  } 	

  else {
    return locationFailure
  }
}

module.exports = {getLocation}
