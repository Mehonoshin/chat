var logger    = require('./logger.js');
var Client    = require('./client.js').Client;
var Message   = require('./message.js').message;
var Transport = require('./transport.js').transport;

exports.ConnectionPool = function(chat) {
  this.chat             = chat;
  this.clients          = [];

  this.newConnection = function(request) {
    var self = this;
    var connection = this.initializeConnection(request);
    var transport = new Transport(connection, this.clients);
    var client = this.initializeClient(transport);

    connection.on('message', function(message) {
      self.processMessage(message, transport, client, self);
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

  this.initializeClient = function(transport) {
    transport.sendHistory(this.chat.getHistory());
    return new Client(this.newClientIndex());
  }

  this.processMessage = function(message, transport, client, context) {
    if (message.type === 'utf8') {
      if (client.userName === false) {
        client.setUserName(message.utf8Data);
        client.userColor = context.chat.getNextRandomColor();
        transport.sendMessageToClient(client.userColor);
        logger.clientIdentified(client);
      } else {
        var message = new Message((new Date()).getTime(), message.utf8Data, client);
        logger.newMessage(client, message);
        context.chat.persistMessage(message);
        transport.broadcastMessage(message);
      }
    }
  }

  // Connection handling methods
  this.connectionTerminate = function(connection, client, context) {
    if (client.userName !== false && client.userColor !== false) {
      logger.clientDisconnected(connection);
      context.clients.splice(client.index, 1);
      context.colorsRepository.returnColor(client.userColor);
    }
  }

  this.persistConnection = function(connection) {
    this.clients.push(connection)
  }

  this.newClientIndex = function() {
    return this.clients - 1;
  }
}
