var app = angular.module('chat', []);

app.controller('NavigationController', function() {
  this.currentPage = 'index';

  this.isCurrentPage = function(pageName) {
    return this.currentPage == pageName;
  };

  this.setCurrentPage = function(pageName) {
    this.currentPage = pageName;
  };
});

app.directive('navigationArea', function() {
  return {
    restrict: 'E',
    templateUrl: 'navigation-area.html'
  };
});

app.directive('chatArea', function() {
  return {
    restrict: 'E',
    templateUrl: 'chat-area.html'
  };
});

app.directive('historyArea', function() {
  return {
    restrict: 'E',
    templateUrl: 'history-area.html'
  };
});


