var express = require('express');
var redis = require('redis');
var client = redis.createClient(9427, 'ray.redistogo.com');
client.auth('adee4c8cca66de7ae8b4d6b012ce844d');
var app = express.createServer();
app.use(express.favicon());
app.use(function (req, res, next) {
  client.incr('views');
  return next();
});
app.use(express.static(process.cwd() + '/public'));
app.listen(process.env.port || 8080);

app.get('/health', function(req, res, next){
  client.get('views', function (error, views) {
    if (error) {
      throw new Error(error);
    }
    res.json({
      pid: process.pid,
      uptime: process.uptime(),
      views: views
    });
  });
});

app.on('error', function appError (error) {
  console.log('app error:', error);
});

process.on('uncaughtException', function uncaughtException (error) {
  console.error('uncaughtException:', error.message);
  console.error(error.stack);
  process.exit(1);
});

var dnode = require('dnode');

var server = dnode({
    addRoute : function (path, troll, cb) {
      app.get(path, function (req, res, next) {
        res.send(troll);
      });
      return cb(null, 'lol');
    }
});
server.listen(app);