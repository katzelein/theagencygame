
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var path = require('path');

var routes = require('./routes');
var db = require('./models');

// app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
  res.send("I'm working!")
})

app.use('/', routes);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

module.exports = app;

// listen on a port
var port = process.env.PORT || 3000; // potentially use process.env.PORT
app.listen(port, function () {
  console.log('The server is listening closely on port', port);
  db.sync()
  .then(function () {
    console.log('Synchronated the database');
  })
  .catch(function (err) {
    console.error('Trouble right here in River City', err, err.stack);
  });
});