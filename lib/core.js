var colors  = require('./colors_repository.js');
var logger  = require('./logger.js');
var Client  = require('./client.js').Client;
var Message = require('./message.js').message;

exports.ConnectionPool = function() {
  this.history = [];
  this.clients = [];
  this.colorsRepository = new colors.repository();

  this.newConnection = function(request) {
    var self = this;
    var connection = this.initializeConnection(request);
    var client = this.initializeClient(connection);

    connection.on('message', function(message) {
      self.processMessage(message, connection, client, self);
    });

    connection.on('close', function(connection) {
      self.connectionTerminate(connection, client, self);
    });
  }

  this.initializeConnection = function(request) {
    logger.newConnection(request.origin);
    var connection = request.accept(null, request.origin);
    this.persistConnection(connection);
    logger.connectionAccepted();
    return connection;
  }

  this.initializeClient = function(connection) {
    this.sendHistory(connection);
    return new Client(this.newClientIndex());
  }

  this.processMessage = function(message, connection, client, context) {
    if (message.type === 'utf8') {
      if (client.userName === false) {
        client.setUserName(message.utf8Data);
        client.userColor = context.colorsRepository.getColor();
        connection.sendUTF(JSON.stringify({ type:'color', data: client.userColor }));
        logger.clientIdentified(client);
      } else {
        var message = new Message((new Date()).getTime(), message.utf8Data, client)
        logger.newMessage(client, message);
        context.persistMessage(message);

        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: message.toJson() });
        for (var i=0; i < context.clients.length; i++) {
            context.clients[i].sendUTF(json);
        }
      }
    }
  }

  this.connectionTerminate = function(connection, client, context) {
    if (client.userName !== false && client.userColor !== false) {
      logger.clientDisconnected(connection);
      context.clients.splice(client.index, 1);
      context.colorsRepository.returnColor(client.userColor);
    }
  }

  this.sendHistory = function(connection) {
    var data = this.history.map(function(message) { return message.toJson(); });
    if (this.history.length > 0) {
      connection.sendUTF(JSON.stringify( { type: 'history', data: data } ));
    }
  }

  this.persistConnection = function(connection) {
    this.clients.push(connection)
  }

  this.persistMessage = function(message) {
    this.history.push(message);
    this.history = this.history.slice(-100);
  }

  this.newClientIndex = function() {
    return this.clients - 1;
  }

}
