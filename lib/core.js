var helpers = require('./helpers.js')
var colors = require('./colors_repository.js');

var colorsRepository = new colors.repository();

exports.ConnectionPool = function() {
  this.history = [];
  this.clients = [];

  this.newConnection = function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = this.clients.push(connection) - 1;
    var userName = false;
    var userColor = false;
    var self = this;

    console.log((new Date()) + ' Connection accepted.');

    // send back chat history
    if (this.history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: this.history} ));
    }

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text
            if (userName === false) { // first message sent by user is their name
                // remember user name
                userName = helpers.htmlEntities(message.utf8Data);
                // get random color and send it back to the user
                userColor = colorsRepository.getColor();
                connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
                console.log((new Date()) + ' User is known as: ' + userName
                            + ' with ' + userColor + ' color.');

            } else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                            + userName + ': ' + message.utf8Data);

                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: helpers.htmlEntities(message.utf8Data),
                    author: userName,
                    color: userColor
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
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            self.clients.splice(index, 1);
            // push back user's color to be reused by another user
            colorsRepository.returnColor(userColor);
        }
    });
  }

}
