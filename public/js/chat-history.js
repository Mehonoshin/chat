(function(){
  var app = angular.module('chat-history', []);

  app.controller('HistoryController', ['$http', function($http) {
    var history = this;
    history.messages = [];
    history.currentRange = 'today';

    this.isCurrentRange = function(range) {
      return this.currentRange == range;
    };

    this.setCurrentRange = function(range) {
      $http.get('/api/history').success(function(data) {
        history.messages = data;
      });
      this.currentRange = range;
    };
  }]);
})();
