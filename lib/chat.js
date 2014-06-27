var colors    = require('./colors_repository.js');
var Message   = require('./message.js').message;

exports.chat = function() {
  this.history          = [];
  this.colorsRepository = new colors.repository();
  var self = this;

  this.getNextRandomColor = function() {
    return this.colorsRepository.getColor();
  }

  this.persistMessage = function(message) {
    message.persist();
    this.history.push(message);
    this.history = this.history.slice(-100);
  }

  this.getHistory = function() {
    return this.history.map(function(message) { return message.toJson() });
  }

  this.loadHistory = function() {
    Message.loadAll(3, function(messages) {
      self.history = messages.reverse();
    });
  }

  this.loadHistory();
}
