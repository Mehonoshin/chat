function ChatState() {
  this.messages = [];
  this.members  = [];

  this.addMessage = function(message) {
    this.messages.push(message);
  }

  this.setMembers = function(members) {
    this.members = members;
  }
}
