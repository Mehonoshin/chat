var helpers = require('./helpers.js')

exports.message = function(time, text, client) {
  this.client = client;
  this.text = text;
  this.time = time;

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
