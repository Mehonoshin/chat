exports.ChatState = function(chat, clients) {
  this.history = chat.getHistory();

  this.members = [];
  for (i = 0; i < clients.length; i++) {
    this.members.push({ userName: clients[i].userName, userColor: clients[i].userColor });
  }
}
