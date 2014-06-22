exports.transport = function(currentConnection, allConnections) {
  this.currentConnection = currentConnection;
  this.allConnections = allConnections;

  this.sendMessageToClient = function(data) {
    this.deliverMessage({type:'color', data: data});
  }

  this.broadcastMessage = function(message) {
    var json = {type:'message', data: message.toJson()};
    for (var i=0; i < this.allConnections.length; i++) {
      this.deliverMessage(json, this.allConnections[i]);
    }
  }

  this.sendHistory = function(history) {
    var data = history.map(function(message) { return message.toJson(); });
    if (history.length > 0) {
      this.deliverMessage({type: 'history', data: data});
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
