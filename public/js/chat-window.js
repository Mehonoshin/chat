(function() {
  var app = angular.module('chat-window', []);

  app.controller('ChatController', ['$scope', '$anchorScroll', '$location', function($scope, $anchorScroll, $location) {
    var chat            = this;
    $scope.user         = new CurrentUser();
    $scope.messages     = [];
    $scope.members      = [];
    this.connection     = null;

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
        $scope.messages.push(message);
      });
    };

    this.setUserColor = function(message) {
      $scope.$apply(function() {
        $scope.user.setColor(message);
        $scope.user.setState('active');
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
