function CurrentUser() {
  this.state          = 'connecting';
  this.color          = '';
  this.currentMessage = '';
  this.name           = '';
  this.soundEnabled   = true;

  this.setState = function(newState) {
    this.state = newState;
  }

  this.setColor = function(newColor) {
    this.color = newColor;
  }

  this.prependToCurrentMessage = function(name) {
    this.currentMessage = name + ", " + this.currentMessage;
  }

  this.isState = function(assertState) {
    return this.state == assertState;
  }

  this.resetCurrentMessage = function() {
    this.currentMessage = '';
  }

  this.isSoundEnabled = function() {
    return this.soundEnabled == true;
  }
}
