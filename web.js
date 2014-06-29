var express = require('express');
var app = express();

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

app.use(express.static(__dirname + '/public'));
