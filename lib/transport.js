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
    var json = { type: 'message', data: message.toJson() };
    for (var i = 0; i < this.allClients.length; i++) {
      this.deliverMessage(json, this.allClients[i].connection());
    }
  }

  this.broadcastClientJoin = function(client) {
    var json = {
      type: 'newMember',
      data: {
        text: client.userName + ' joined chat',
        color: client.userColor,
        type: 'system'
      }
    };
    for (var i = 0; i < this.allClients.length; i++) {
      this.deliverMessage(json, this.allClients[i].connection());
    }
  }

  this.broadcastUpdatedMembersList = function(state) {
    var json = {
      type: 'membersList',
      data: {
        members: state.members,
        type: 'update'
      }
    };
    for (var i = 0; i < this.allClients.length; i++) {
      this.deliverMessage(json, this.allClients[i].connection());
    }
  }

  this.sendInitialChatState = function(state) {
    this.deliverMessage({type: 'initialState', data: state});
  }

  this.deliverMessage = function(data, connection) {
    if (connection == undefined) {
      this.currentConnection.sendUTF(JSON.stringify(data));
    } else {
      connection.sendUTF(JSON.stringify(data));
    }
  }
}
