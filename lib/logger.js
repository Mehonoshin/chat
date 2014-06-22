exports.connectionAccepted = function() {
  console.log((new Date()) + ' Connection accepted.');
}

exports.newConnection = function(origin) {
  console.log((new Date()) + ' Connection from origin ' + origin + '.');
}

exports.clientIdentified = function(client) {
  console.log((new Date()) + ' User is known as: ' + client.userName
              + ' with ' + client.userColor + ' color.');
}

exports.newMessage = function(client, message) {
  console.log((new Date()) + ' Received Message from '
              + client.userName + ': ' + message.getText());
}

exports.clientDisconnected = function(connection) {
  console.log((new Date()) + " Peer "
      + connection.remoteAddress + " disconnected.");
}
