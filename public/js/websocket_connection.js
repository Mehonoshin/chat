function WebsocketConnection() {
  var wsUrlBuilder = new WebsocketUrlBuilder();

  window.WebSocket = window.WebSocket || window.MozWebSocket;
  if (!window.WebSocket) {
    alert('Sorry, but your browser doesnt support WebSockets.');
  }

  this.connection = function(connectionOpened, messageRecieved, connectionCorrupted) {
    var activeConnection       = new WebSocket(wsUrlBuilder.url());
    activeConnection.onopen    = connectionOpened;
    activeConnection.onmessage = messageRecieved;
    activeConnection.onerror   = connectionCorrupted;
    return activeConnection;
  };
};
