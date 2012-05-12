var express = require('express')
  , routes = require('./routes');


var app = express.createServer(express.logger());

//app.configure(function(){
//  app.set('views', __dirname + '/views');
//  app.set('view engine', 'jade');
//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(app.router);
//  app.use(express.static(__dirname + '/public'));
//});

//app.configure('development', function(){
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//});

//app.configure('production', function(){
//  app.use(express.errorHandler());
//});

app.get('/', function(req, resp) {
//    resp.redirect('/index.html');
  resp.send('Hello World!');
});

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
