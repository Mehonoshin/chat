// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
process.title = 'node-chat';

var core            = require('./lib/core.js');
var Chat            = require('./lib/chat.js').chat;
var http            = require('http');
var webSocketServer = require('websocket').server;
var logger          = require('./lib/logger.js');
var config          = require('config');
var wsConfig        = config.Ws;

var chat           = new Chat();
var connectionPool = new core.ConnectionPool(chat);
var server         = http.createServer(function(request, response) {});

server.listen(wsConfig.port, function() {
  logger.serverStarted(wsConfig.port);
});

var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  connectionPool.newConnection(request);
});
