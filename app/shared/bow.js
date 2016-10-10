var mysql      = require('mysql');
var P = require('bluebird');
var nconf = require('nconf');

var connection = mysql.createConnection({
  host     : nconf.get('mysqlHost'),
  user     : nconf.get('mysqlUser'),
  password : nconf.get('mysqlPassword'),
  database : nconf.get('mysqlDatabase')
});

module.exports = {
    createBow: function(bow) {
        return new P(function(resolve, reject){
            connection.query('INSERT INTO bow SET ?', bow, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                bow.id = rows.insertId;
                resolve(bow);
            });    
        });
    },
    updateBow: function(bow) {
        return new P(function(resolve, reject){
            connection.query('UPDATE bow SET ? WHERE id=?', [bow, bow.id], function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(bow);
            });    
        });
    },
    getBow: function(id) {
        return new P(function(resolve, reject){
            connection.query('SELECT * FROM bow WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });    
        });
    },
    getMemberBows: function(member_id) {
        return new P(function(resolve, reject){
            connection.query('SELECT b.*, bt.name bow_type_name FROM bow b INNER JOIN bow_type bt ON (b.bow_type = bt.id) WHERE member_id=? ORDER BY b.name ASC', member_id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    },
    getTypes: function() {
        return new P(function(resolve, reject){
            connection.query('SELECT * FROM bow_type', function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    },
    deleteBow: function(id) {
        return new P(function(resolve, reject){
            connection.query('DELETE FROM bow WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    }
}
