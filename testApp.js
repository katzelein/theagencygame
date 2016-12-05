const express = require('express');
const app = express();
const volleyball = require('volleyball');
const Client = require('authy-client').Client;
const authyKey = require('./variables').authyKey
const secret = require('./variables').secret

const client = new Client({ key: authyKey });
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const db = require('./models');
const User = db.models.users
const {resolve} = require('path')
const appEnv = typeof global.it === 'function'
console.log("APP ENV IN TEST APP: ", appEnv)



app.use(require('cookie-session') ({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'an insecure secret key'],
}))
app.use(volleyball);

app.use(cookieParser());
app.use(expressSession({'secret': 'secret'}));
// app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("dirname: ", __dirname)
app.use(express.static(resolve(__dirname, 'public')));
console.log("public: ", resolve(__dirname, 'public'))
//app.get('/bundle.js', (_, res) => res.sendFile(resolve(__dirname, 'index.html')));

app.use(function(req, res, next) {
  console.log("SET SESSION!!!")
  //let number = process.env.ADMIN ? '+19146469702' : 'bad'
  console.log("ADMIN ENV: ", process.env.ADMIN)
  
  if(process.env.ADMIN === 'true'){
    console.log("SETTING USER TO ADMIN")
    User.findOne({
          where: {
            phoneNumber: '+19146469702'
          }
      })
      .then(user => {
      req.session.user = user
        next();
      })
  }
  else{
    console.log("SETTING USER TO NULL")
    req.session.user = null;
    next()
  }
   
});

app.use('/', routes);
//app.get('/*', (_, res) => res.sendFile(resolve(__dirname, 'public', 'index.html')))
app.get('/*', (_, res) => res.sendFile(resolve(__dirname, 'index.html')))

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

module.exports = app;
