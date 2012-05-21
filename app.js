var nodetime = require('nodetime');

nodetime.profile(function (hmm, sup) {
  console.error(hmm);
  console.log(sup);
});

var nodetimeId;

nodetime.on('session', function nodetimeSession (id) {
  nodetimeId = id;
});

var express = require('express');
var app = express.createServer();
app.use(express.favicon());
app.use(express.static(process.cwd() + '/public'));
app.listen(process.env.port || 8080);

app.get('/health', function(req, res, next){
  res.json({
    pid: process.pid,
    uptime: process.uptime(),
    nodetimeId: nodetimeId
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

var net = require('net');
var repl = require("repl");

net.createServer(function tcpRepl (socket) {
  repl.start("trololol> ", socket).context.app = app;
}).listen(5000);