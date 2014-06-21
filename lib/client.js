var helpers = require('./helpers.js')

exports.Client = function(index) {
  this.index     = index;
  this.userName  = false;
  this.userColor = false;

  this.setUserName = function(userName) {
    this.userName = helpers.htmlEntities(userName);
  }
}
