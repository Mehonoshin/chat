var helpers = require('./helpers.js');
var Db      = require('./db.js').db;

exports.message = function(time, text, client) {
  this.client = client;
  this.text   = text;
  this.time   = time;
  this.db     = new Db();

  this.db.persistMessage(text, client.userName);

  this.getText = function() {
    return helpers.htmlEntities(this.text);
  }

  this.toJson = function() {
    var json = { 
      time: this.time, 
      text: this.text, 
      author: this.client.userName,
      color: this.client.userColor
    }
    return json;
  }
}
