var colors    = require('./colors_repository.js');

exports.chat = function() {
  this.history          = [];
  this.colorsRepository = new colors.repository();

  this.getNextRandomColor = function() {
    return this.colorsRepository.getColor();
  }

  this.persistMessage = function(message) {
    this.history.push(message);
    this.history = this.history.slice(-100);
  }

  this.getHistory = function() {
    return this.history.map(function(message) { return message.toJson() });
  }

}
