var helpers = require('./helpers.js')

exports.Client = function(transport, index, chat) {
  this.index     = index;
  this.userName  = 'Guest';
  this.transport = transport;
  this.chat      = chat;

  this.setUserName = function(userName) {
    this.userName = helpers.htmlEntities(userName);
  }

  this.connection = function() {
    return this.transport.currentConnection;
  }

  this.terminate = function() {
    this.chat.colorsRepository.returnColor(this.userColor);
  }

  this.assignColor = function() {
    this.userColor = this.chat.getNextRandomColor();
  }
}
