var logger    = require('./logger.js');
var Client    = require('./client.js').Client;
var Message   = require('./message.js').message;
var Transport = require('./transport.js').transport;

exports.ConnectionPool = function(chat) {
  this.chat             = chat;
  this.clients          = [];

  this.newConnection = function(request) {
    var self = this;
    var client = this.initializeClient(request);
    client.transport.sendHistory(this.chat.getHistory());

    client.connection().on('message', function(message) {
      self.processMessage(message, client);
    });

    client.connection().on('close', function(client) {
      self.connectionTerminate(client, self);
    });
  }

  this.initializeClient = function(request) {
    var transport = new Transport(request, this.clients);
    var client = new Client(transport, this.newClientIndex(), chat);
    this.persistClient(client);
    return client;
  }

  this.processMessage = function(message, client) {
    if (message.type === 'utf8') {
      if (this.isInitialMessage(client)) {
        this.processInitialMessage(message, client);
      } else {
        this.processMessage(message, client);
      }
    }
  }

  // Connection handling methods
  this.connectionTerminate = function(client, context) {
    if (client.userName !== false && client.userColor !== false) {
      logger.clientDisconnected(client.connection());
      context.clients.splice(client.index, 1);
      client.terminate();
    }
  }

  // Messages processing methods
  this.isInitialMessage = function(client) {
    return (client.userName === false);
  }

  this.processInitialMessage = function(message, client) {
    client.setUserName(message.utf8Data);
    client.transport.sendMessageToClient(client.userColor);
    logger.clientIdentified(client);
  }

  this.processMessage = function(message, client) {
    var message = new Message((new Date()).getTime(), message.utf8Data, client);
    client.chat.persistMessage(message);
    client.transport.broadcastMessage(message);
    logger.newMessage(client, message);
  }
  // End messages processing

  this.persistClient = function(client) {
    this.clients.push(client);
  }

  this.newClientIndex = function() {
    return this.clients - 1;
  }
}
