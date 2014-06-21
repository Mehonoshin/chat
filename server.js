// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
process.title = 'node-chat';

var core            = require('./lib/core.js');
var http            = require('http');
var webSocketServer = require('websocket').server;

var webSocketsServerPort = 1337;

var connectionPool = new core.ConnectionPool();
var server         = http.createServer(function(request, response) {});

server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  connectionPool.newConnection(request);
});
