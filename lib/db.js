var pg = require('pg');
var config = require('config');
var dbConfig = config.Db;

exports.db = function() {

  this.persistMessage = function(content, username) {
    pg.connect(this.connectionString(), function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      var now = new Date();

      client.query(
        'INSERT INTO messages (username,content,created_at) VALUES($1,$2,$3) ',
        [username, content, now],
        function(err, result) {
          done();

          if (err) {
            return console.error('error running query', err);
          }
        });
      });
    }

  this.loadMessages = function(numberToLoad, callback) {
    pg.connect(this.connectionString(), function(err, client, done) {
      client.query('SELECT * FROM messages ORDER BY id DESC LIMIT $1', [numberToLoad], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        callback(result.rows);
      });
    });
  }

  this.connectionString = function() {
    var conString = "postgres://" 
      + dbConfig.username + ":" 
      + dbConfig.password + "@" 
      + dbConfig.host + "/" 
      + dbConfig.dbname;
    return conString;
  }
}
