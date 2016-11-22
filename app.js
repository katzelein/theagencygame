
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var path = require('path');

var routes = require('./routes');
var db = require('./models');

// app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

module.exports = app;

// listen on a port
var port = process.env.PORT || 3000; // needs to be used whenever you're not in development
app.listen(port, function () {
  console.log('The server is listening closely on port', port);
  db.sync({force:true})
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