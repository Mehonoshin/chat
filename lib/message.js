var helpers = require('./helpers.js');
var Db      = require('./db.js').db;

var Message = function(time, text, client) {
  this.client = client;
  this.text   = text;
  this.time   = time;

  this.persist = function() {
    var db = new Db();
    db.persistMessage(text, client.userName);
  }

  this.getText = function() {
    return helpers.htmlEntities(this.text);
  }

  this.toJson = function() {
    var json = {
      time: this.time,
      text: this.text,
      author: this.client.userName,
      color: this.client.userColor,
      type: 'reply'
    }
    return json;
  }
}

Message.where = function(params, callback) {
  var db = new Db();
  params.table = 'messages';
  var rows = db.load(params, function(rows) {
    var messages = [];
    for(i = 0; i < rows.length; i++) {
      messages.push(new Message(rows[i].created_at, rows[i].content, {userName: rows[i].username }));
    }
    callback(messages);
  });
}

exports.message = Message;
