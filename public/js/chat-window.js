(function() {
  var app = angular.module('chat-window', []);

  app.controller('ChatController', ['$scope', '$anchorScroll', '$location', function($scope, $anchorScroll, $location) {
    var chat             = this;
    $scope.user          = new CurrentUser();
    $scope.chatState     = new ChatState();

    this.connection      = null;
    var messageHandlers  = {
      color: function(message) {
        chat.setUserColor(message);
      },
      initialState: function(message) {
        chat.loadHistory(message.history);
        chat.loadMembersList(message.members);
      },
      membersList: function(message) {
        chat.loadMembersList(message.members);
      },
      memberChange: function(message) {
        chat.processNewMessage(message);
      },
      message: function(message) {
        chat.processNewMessage(message);
        chat.playSound();
      }
    };

    // Public methods
    this.initialize = function() {
      var wsConnection = new WebsocketConnection();
      this.connection  = wsConnection.connection(this.connectionOpened, this.messageRecieved, this.connectionCorrupted);
    };

    this.connectionOpened = function() {
      $scope.$apply(function() {
        $scope.user.setState('waitingForName');
      });
    };

    this.connectionCorrupted = function(error) {
      console.log('ws error');
      console.log(error);
    };

    this.messageRecieved = function(message) {
      var json    = JsonParser(message.data);
      var action  = json.type;
      var message = json.data;

      messageHandlers[action](message);

      $location.hash('bottom');
      $anchorScroll();
    };

    this.setUserName = function($event) {
      if ($event.keyCode === 13) {
        this.connection.send($scope.user.name);
        $scope.user.setState('active');
      };
    };

    this.sendMessage = function($event) {
      if ($event.keyCode === 13) {
        this.connection.send($scope.user.currentMessage);
        $scope.user.resetCurrentMessage();
      };
    };

    // Private methods
    this.processNewMessage = function(message) {
      $scope.$apply(function() {
        $scope.chatState.addMessage(message);
      });
    };

    this.setUserColor = function(message) {
      $scope.$apply(function() {
        $scope.user.setColor(message);
        $scope.user.setState('active');
      });
    };

    this.loadHistory = function(messages) {
      $scope.$apply(function() {
        for (var i = 0; i < messages.length; i++) {
          $scope.chatState.addMessage(messages[i]);
        }
      });
    };

    this.loadMembersList = function(members) {
      $scope.$apply(function() {
        $scope.chatState.setMembers(members);
      });
    };

    this.playSound = function() {
      if ($scope.user.isSoundEnabled()) {
        document.getElementById('message-sound').play();
      }
    };
  }]);

  app.directive('chatMessage', function() {
    templateUrl = function() {
    };

    return {
      restrict: 'E',
      templateUrl: '/messages/base.html',
      link: function(scope, element, attrs) {
        scope.polymorphicTemplateUrl = function() {
          var url = '/messages/reply.html';
          if (scope.message.type == 'system') {
            url = '/messages/system.html';
          }
          if (scope.message.text.substring(0, 3) == "/me") {
            url = '/messages/third-face-reply.html';
          }
          return url;
        }
      }
    };
  });
})();
