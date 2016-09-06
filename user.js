var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var RedisStore = require('connect-redis')(session);
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var app = express();
//var http = require('http');
var routes = require('./routes');
//var user = require('./routes/user');
//var path = require('path');
//var fs = require('fs');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// session init for app
app.use(session(
  {
    secret: "shshshsh",
    saveUninitialized: "false",
    resave: "true"
  }
  ));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', routes.index);
var sess;
app.get('/',function(req,res){
sess = req.session;
//Session set when user Request our app via URL
if(sess.username) {
/*
* This line check Session existence.
* If it existed will do some action.
*/
    res.redirect('/admin');
}
else {
    res.render('index.html');
}
});

var username;

app.post('/login',function(req,res){
sess_id = req.session.id;
//In this we are assigning username to sess.username variable.
//username comes from HTML page.
  username=req.body.username;
  res.end('done');
});

app.get('/admin',function(req,res){
sess_id = req.session.id;
if(username) {
  res.write('<h1>Hello '+ username+'</h1>');
} else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href="+">Login</a>');
}
});

app.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});
});

// start the server on the given port and binding host, and print
// url to server when it starts

app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
  console.log("server listening on port" + appEnv.port);
});
