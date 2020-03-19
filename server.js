var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var port        = process.env.PORT || 8080;
var passport	= require('passport');
var router      = require('./routes')
const fs = require('fs');
const https = require('https');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

 
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// log to console
app.use(morgan('dev'));
// Use the passport package in our application
app.use(passport.initialize());


 
// demo Route
app.get('/', function(req, res) {
  res.send('Hello CamBulders!!!');
});

app.use('/api', router);

const server = https.createServer({key: key, cert: cert }, app);
// Start the server
server.listen(port);
