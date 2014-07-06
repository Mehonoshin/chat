function WebsocketUrlBuilder() {
  this.url = function() {
    var path = 'ws://' + window.location.hostname;
    if (window.location.hostname == 'localhost') {
      path = path + ':1337';
    }
    return path;
  }
};


