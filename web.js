var express = require('express');
var app     = express();
var Message = require('./lib/message.js').message;
var config  = require('config');
var webConfig = config.Web;

var server = app.listen(webConfig.port, function() {
  console.log('Listening on port %d', server.address().port);
});

app.use(express.static(__dirname + '/public'));

app.get('/api/history', function(req, res) {
  var messagesHistory = [];
  Message.where({dateScope: req.param('scope')}, function(messages) {
    messagesHistory = messages.reverse();
    res.send(messagesHistory);
  });
});
