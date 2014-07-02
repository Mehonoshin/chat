(function(){
  var app = angular.module('chat-history', []);

  app.controller('HistoryController', function() {
    this.currentRange = 'today';

    this.isCurrentRange = function(range) {
      return this.currentRange == range;
    };

    this.setCurrentRange = function(range) {
      this.currentRange = range;
    };
  });
})();
