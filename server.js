var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var port        = 3000;
var passport	= require('passport');
var router      = require('./routes')
const fs = require('fs');
const https = require('https');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
var response    = require('./app/models/response');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false })); // app to send in  form encoded not a text file
app.use(bodyParser.json()); // app to send the reesponse in form of JSON
// log to console
app.use(morgan('dev'));
// Use the passport package in our application
app.use(passport.initialize());

// demo Route
app.get('/', function(req, res) {
 return res.status(200).json(new response(200, null, "Hello cam builders").JSON)
});

app.use('/api', router);

const server = https.createServer({key: key, cert: cert }, app);
// Start the server
server.listen(port);
