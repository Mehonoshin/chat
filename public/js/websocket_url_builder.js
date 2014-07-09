function WebsocketUrlBuilder() {
  this.url = function() {
    var path = 'ws://' + window.location.hostname + ':1337';
    return path;
  }
};


