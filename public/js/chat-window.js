(function() {
  var app = angular.module('chat-window', []);

  app.controller('ChatController', ['$scope', function($scope) {
    var chat        = this;

    $scope.messages   = [];
    $scope.state      = 'connecting';
    $scope.userColor  = '';

    this.userName       = '';
    this.currentMessage = '';
    this.connection     = null;

    this.initialize = function() {
      // TODO:
      // Maybe move to some WsConnection class
      // new WsConnection(connOpnd, msgRcvd, connCorr);
      window.WebSocket = window.WebSocket || window.MozWebSocket;
      if (!window.WebSocket) {
        alert('Sorry, but your browser doesnt support WebSockets.');
      }

      chat.connection           = new WebSocket(this.wsUrl());
      chat.connection.onopen    = chat.connectionOpened;
      chat.connection.onmessage = chat.messageRecieved;
      chat.connection.onerror   = chat.connectionCorrupted;
    };

    this.connectionOpened = function() {
      $scope.$apply(function() {
        $scope.state = 'waitingForName';
      });
    };

    this.connectionCorrupted = function(error) {
      alert("Sorry, but there some problem with your connection or the server is down.");
    };

    this.messageRecieved = function(message) {
      var json    = chat.parseJSON(message.data);
      var action  = json.type;
      var message = json.data;

      if (action === 'color') {
        $scope.$apply(function() {
          $scope.userColor = message;
          $scope.state = 'active';
        });
        // Set username's color here
      } else if (action === 'history') {
        $scope.$apply(function() {
          for (var i = 0; i < message.length; i++) {
            $scope.messages.push(message[i]);
          }
        });
      } else if (action === 'message') {
        $scope.$apply(function() {
          $scope.messages.push(message);
        });
      } else {
        console.log('Hmm..., I\'ve never seen JSON like this: ', json);
      }
    };

    this.setUserName = function($event) {
      if ($event.keyCode === 13) {
        this.connection.send(this.userName);
        $scope.state = 'active';
      };
    };

    this.sendMessage = function($event) {
      if ($event.keyCode === 13) {
        this.connection.send(this.currentMessage);
        this.currentMessage = '';
      };
    };

    this.isState = function(state) {
      return $scope.state == state;
    };

    // TODO:
    // Extract to ws url builder class
    this.wsUrl = function() {
      var path = 'ws://' + window.location.hostname;
      if (window.location.hostname == 'localhost') {
        path = path + ':1337';
      }
      return path;
    };

    this.parseJSON = function(data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }
    };

  }]);
})();
