
const express = require('express');
const app = express();
const volleyball = require('volleyball');
const Client = require('authy-client').Client;
const authyKey = require('./constants').authyKey
const secret = require('./constants').secret

const client = new Client({ key: authyKey });
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const db = require('./models');
const {resolve} = require('path')

app.use(volleyball);

app.use(cookieParser());
app.use(expressSession({'secret': secret}));
// app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("dirname: ", __dirname)
app.use(express.static(resolve(__dirname, 'public')));
console.log("public: ", resolve(__dirname, 'public'))
//app.get('/bundle.js', (_, res) => res.sendFile(resolve(__dirname, 'index.html')));
app.use('/', routes);
app.get('/*', (_, res) => res.sendFile(resolve(__dirname, 'public', 'index.html')))

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

module.exports = app;

// listen on a port
var port = process.env.PORT || 3000; // needs to be used whenever you're not in development
app.listen(port, function () {
  console.log('The server is listening closely on port', port);
  db.sync({})
  .then(function () {
    console.log('Synchronated the database');
  })
  .catch(function (err) {
    console.error('Trouble right here in River City', err, err.stack);
  });
});

// 1 G-baby  +19146469096  confirmName 2016-11-19 22:14:01.75-05 2016-11-19 22:14:39.785-05
// 2 Mothership  +19144097230  confirmName 2016-11-19 22:14:45.333-05  2016-11-19 22:15:40.061-05
// 4 Evie  +19739975239  confirmName 2016-11-19 22:50:19.8-05  2016-11-19 22:50:46.574-05