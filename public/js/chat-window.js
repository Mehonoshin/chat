(function() {
  var app = angular.module('chat-window', []);

  app.controller('ChatController', ['$scope', '$anchorScroll', '$location', function($scope, $anchorScroll, $location) {
    var chat            = this;
    $scope.messages     = [];
    $scope.state        = 'connecting';
    $scope.userColor    = '';
    this.userName       = '';
    this.currentMessage = '';
    this.connection     = null;

    // Public methods
    this.initialize = function() {
      var wsConnection = new WebsocketConnection();
      this.connection  = wsConnection.connection(this.connectionOpened, this.messageRecieved, this.connectionCorrupted);
    };

    this.connectionOpened = function() {
      $scope.$apply(function() {
        $scope.state = 'waitingForName';
      });
    };

    this.connectionCorrupted = function(error) {
      console.log('ws error');
    };

    this.messageRecieved = function(message) {
      var json    = chat.parseJSON(message.data);
      var action  = json.type;
      var message = json.data;

      if (action === 'color') {
        chat.setUserColor(message);
      } else if (action === 'history') {
        chat.loadHistory(message);
      } else if (action === 'message') {
        chat.processNewMessage(message);
      } else {
        console.log('Hmm..., I\'ve never seen JSON like this: ', json);
      }
      $location.hash('bottom');
      $anchorScroll();
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

    // Private methods
    this.processNewMessage = function(message) {
      $scope.$apply(function() {
        $scope.messages.push(message);
      });
    };

    this.setUserColor = function(message) {
      $scope.$apply(function() {
        $scope.userColor = message;
        $scope.state = 'active';
      });
    };

    this.loadHistory = function(message) {
      $scope.$apply(function() {
        for (var i = 0; i < message.length; i++) {
          $scope.messages.push(message[i]);
        }
      });
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
