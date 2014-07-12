(function() {
  var app = angular.module('chat-window', []);

  app.controller('ChatController', ['$scope', '$anchorScroll', '$location', function($scope, $anchorScroll, $location) {
    var chat            = this;
    $scope.messages     = [];
    $scope.members      = [];
    $scope.state        = 'connecting';
    $scope.userColor    = '';
    $scope.currentMessage = '';
    this.userName       = '';
    this.soundEnabled   = true;
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
      console.log(error);
    };

    this.messageRecieved = function(message) {
      var json    = chat.parseJSON(message.data);
      var action  = json.type;
      var message = json.data;

      if (action === 'color') {
        chat.setUserColor(message);
      } else if (action === 'initialState') {
        chat.loadHistory(message.history);
        chat.loadMembersList(message.members);
      } else if (action === 'membersList') {
        chat.loadMembersList(message.members);
      } else if (action === 'memberChange') {
        chat.processNewMessage(message);
      } else if (action === 'message') {
        chat.processNewMessage(message);
        chat.playSound();
      } else {
        console.log('Hmm..., I\'ve never seen JSON like this: ', json);
      }

      $location.hash('bottom');
      $anchorScroll();
    };

    this.setNameToReply = function(name) {
      $scope.currentMessage = name + ", " + $scope.currentMessage;
    }

    // TODO:
    // move this data methods to some object like ChatData
    this.setUserName = function($event) {
      if ($event.keyCode === 13) {
        this.connection.send(this.userName);
        $scope.state = 'active';
      };
    };

    this.sendMessage = function($event) {
      if ($event.keyCode === 13) {
        this.connection.send($scope.currentMessage);
        $scope.currentMessage = '';
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

    this.loadMembersList = function(members) {
      $scope.$apply(function() {
        $scope.members = members;
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

    this.playSound = function() {
      if (this.soundEnabled) {
        document.getElementById('message-sound').play();
      }
    };

  }]);
})();
