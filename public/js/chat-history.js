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
      this.currentRange = range;
      this.loadCurrentRangeHistory();
    };

    this.loadCurrentRangeHistory = function() {
      $http.get('/api/history?scope=' + this.currentRange).success(function(data) {
        history.messages = data;
      });
    };

  }]);
})();
