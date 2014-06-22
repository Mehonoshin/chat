var logger    = require('./logger.js');

exports.transport = function(request, allClients) {
  logger.newConnection(request.origin);
  this.currentConnection = request.accept(null, request.origin);
  logger.connectionAccepted();

  this.allClients = allClients;

  this.sendMessageToClient = function(data) {
    this.deliverMessage({type:'color', data: data});
  }

  this.broadcastMessage = function(message) {
    var json = {type:'message', data: message.toJson()};
    for (var i=0; i < this.allClients.length; i++) {
      this.deliverMessage(json, this.allClients[i].connection());
    }
  }

  this.sendHistory = function(history) {
    if (history.length > 0) {
      this.deliverMessage({type: 'history', data: history});
    }
  }

  this.deliverMessage = function(data, connection) {
    if (connection == undefined) {
      this.currentConnection.sendUTF(JSON.stringify(data));
    } else {
      connection.sendUTF(JSON.stringify(data));
    }
  }
}
