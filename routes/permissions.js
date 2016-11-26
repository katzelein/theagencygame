 const epilogue = require('epilogue')
// router.get('/', function (req, res, next) {
//   res.send("I'm working!")
// })

const mustBeAdmin = message => (req, res, context) => {
  if (!req.user || !req.user.isAdmin) {
    console.log("thinks user is not Admin")
    res.status(403).send('You do not have access to this page')
    return context.stop
  }
  else if(req.session.user && req.session.user.isAdmin){
    return context.continue
  }
}

const mustBeLoggedIn = (req, res, context) => {
  if (!req.session.user) {
  	console.log("must be logged in false")
    res.status(401).send('You must be logged in')
    return context.stop
  }

  return context.continue
}

const selfOnly = action => (req, res, context) => {
	console.log("params id: ", req.params.id)
	console.log("session user id: ", req.session.user.id.toString())
  if (req.params.id !== req.session.user.id.toString()) {
  	console.log("param and session not equal")
    res.status(403).send(`You can only ${action} your own dashboard.`)
    return context.stop
  }
  return context.continue  
}

module.exports = {mustBeAdmin, mustBeLoggedIn, selfOnly}