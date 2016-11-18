// start mission

function start (user) {
  User.findOne({where: {phoneNumber: user.From}}) // may not come through as user.From; check req.body
  .then(user => {
    
  })
}