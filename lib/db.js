var pg = require('pg');
var config = require('config');
var dbConfig = config.Db;

exports.db = function() {
  var self = this;

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

  this.load = function(params, callback) {
    pg.connect(this.connectionString(), function(err, client, done) {
      client.query(self.buildSelectQuery(params), [], function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        callback(result.rows);
      });
    });
  }

  this.buildSelectQuery = function(params) {
    var selectQuery = 'SELECT * FROM ' + params.table;
    selectQuery = this.appendDateScope(selectQuery, params);

    selectQuery = this.appendOrderBy(selectQuery, params);
    selectQuery = this.appendLimit(selectQuery, params);
    selectQuery = this.appendStatementTerminator(selectQuery);
    return selectQuery;
  }

  this.appendLimit = function(query, params) {
    if (params.limit != undefined) {
      query = query + ' LIMIT ' + params.limit;
    }
    return query;
  }

  this.appendDateScope = function(query, params) {
    if (params.dateScope != undefined) {
      query = query + '';
    }
    return query;
  }

  this.appendOrderBy = function(query, params) {
    return query + ' ORDER BY id DESC';
  }

  this.appendStatementTerminator = function(query) {
    return query + ';';
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
