var helpers = require('./helpers.js')

exports.Client = function(transport, index, chat) {
  this.index     = index;
  this.userName  = false;
  this.transport = transport;
  this.chat      = chat;
  this.userColor = chat.getNextRandomColor();

  this.setUserName = function(userName) {
    this.userName = helpers.htmlEntities(userName);
  }

  this.connection = function() {
    return this.transport.currentConnection;
  }

  this.terminate = function() {
    chat.colorsRepository.returnColor(this.userColor);
  }
}
