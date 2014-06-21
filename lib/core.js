var helpers = require('./helpers.js')
var colors  = require('./colors_repository.js');
var Client  = require('./client.js').Client;

var colorsRepository = new colors.repository();

exports.ConnectionPool = function() {
  this.history = [];
  this.clients = [];

  this.newConnection = function(request) {
    var self = this;

    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);
    this.persistConnection(connection);
    var client = new Client(this.newClientIndex());

    console.log((new Date()) + ' Connection accepted.');

    // send back chat history
    if (this.history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: this.history} ));
    }

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            if (client.userName === false) {
                client.setUserName(message.utf8Data);
                client.userColor = colorsRepository.getColor();

                connection.sendUTF(JSON.stringify({ type:'color', data: client.userColor }));
                console.log((new Date()) + ' User is known as: ' + client.userName
                            + ' with ' + client.userColor + ' color.');

            } else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                            + client.userName + ': ' + message.utf8Data);

                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: helpers.htmlEntities(message.utf8Data),
                    author: client.userName,
                    color: client.userColor
                };
                self.history.push(obj);
                self.history = self.history.slice(-100);

                // broadcast message to all connected clients
                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < self.clients.length; i++) {
                    self.clients[i].sendUTF(json);
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        if (client.userName !== false && client.userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            self.clients.splice(client.index, 1);
            // push back user's color to be reused by another user
            colorsRepository.returnColor(client.userColor);
        }
    });
  }

  this.persistConnection = function(connection) {
    this.clients.push(connection)
  }

  this.newClientIndex = function() {
    return this.clients - 1;
  }

}
