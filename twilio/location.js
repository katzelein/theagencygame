var rp = require('request-promise');
//const credentials = require('../key')
var geocoder = require('geocoder');
const locationFailure = "We were unable to pinpoint your location, please try again or type 'help'"

function getLocationiPhone(message){
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


function getLocationAndroid(message){
    console.log("looking for location!!")
    let urlString = message.Body.replace(/["']/g, "")
    let urlArray = urlString.split(/\r?\n/)
    //let urlArray = urlString.split("HELLO")
    console.log("urlArray: ", urlArray)
    let LL;

    // if(urlArray.length < 1){
    //   ret error
    // }

    if(urlArray[1].toLowerCase().indexOf('location') !== -1){
      let sliceI = urlArray[1].toLowerCase().indexOf('location') + 7
      let locationStr = urlArray[1].slice(sliceI)
      let numI = locationStr.search(/\d/g)
      let endI = locationStr.search("&z")


      return new Promise(function(resolve, reject){
        if(endI !== -1){
          LL = locationStr.slice(numI, endI).split(",")
        }

        if(LL.length === 2 && LL[0] <= 90 && LL[0] >= -90 && LL[1] <= 180 && LL[1] >= -180){
          resolve(LL)
        }

        else{
          reject(locationFailure)
        }
      })

    }



    else{
      let address = urlArray[2]

      if(address.indexOf("http") !== -1){
        address=address.slice(0, address.indexOf("http"))
      }
      console.log("ADDRESS: ", address)


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
          // console.log("DATA: ", data)
          // console.log("RES: ", data.results)
          // console.log("RES TYPE: ", typeof data.results)
          // console.log("GEOM: ", data.results[0].geometry.location)
          // console.log("COMP: ", data.results[0])
          // console.log("LL: ", LL)
          // console.log("data type: ", typeof data)
          return LL
        //locationRes = LL
        }

      })
      .catch(err => console.log(err))
    }
}

function getLocationFromText(message){
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
          let LL = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng]
          // console.log(data.results)
          // console.log("DATA: ", data)
          // console.log("RES: ", data.results)
          // console.log("RES TYPE: ", typeof data.results)
          // console.log("GEOM: ", data.results[0].geometry.location)
          // console.log("COMP: ", data.results[0])
          // console.log("LL: ", LL)
          // console.log("data type: ", typeof data)
          return LL
      //locationRes = LL
        } 
    })
    .catch(err => console.log(err))
}


function getLocation(message){
  var locationRes;
  console.log("message inside getLocation: ", message)
  console.log("message keys: ", Object.keys(message))
  console.log("message body inside getLocation: ", message.Body)
  // *********** SENT WITH IPHONE *************
  if(message.MediaContentType0 === 'text/x-vcard'){
    return getLocationiPhone(message)

  }
 // ********** SENT WITH PHONE USING GOOGLE MAPS (ie google phone or android) **********
  else if(message.Body.indexOf("maps.google.com") !== -1){

    return getLocationAndroid(message)
  
  }


// ********** ADDRESS SENT DIRECTLY IN TEXT **********
   else if(message.Body){

    return getLocationFromText(message)

  }

// ************ NO MESSAGE BODY OR V-CARD SENT
  else {
    return new Promise(function(resolve, reject){
      resolve(locationFailure)
    })
    .then(locationFailure => locationFailure)
  }
}

//console.log("GET LOCATION: ", getLocation({Body:  'Shared location\nhttps://maps.google.com/?t=m&q=40.70542,-74.00899+(Shared+location)&ll=40.70542,-74.00899&z=17'}).then(resp => console.log("RES: ", resp)))

module.exports = {getLocation}