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
    createMember: function(member) {
        return new P(function(resolve, reject){
            connection.query('INSERT INTO member SET ?', member, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                member.id = rows.insertId;
                resolve(member);
            });    
        });
    },
    getMemberByEmail: function(email) {
        return new P(function(resolve, reject){
            connection.query('SELECT * FROM member WHERE email=?', email, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });    
        });
    },
    updateMember: function(member) {
        return new P(function(resolve, reject){
            connection.query('UPDATE member SET ? WHERE id=?', [member, member.id], function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(member);
            });    
        });
    },
    getMember: function(id) {
        return new P(function(resolve, reject){
            connection.query('SELECT * FROM member WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });    
        });
    },
    deleteMember: function(id) {
        return new P(function(resolve, reject){
            connection.query('DELETE FROM member WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    },
    hasAccess: function(token, id) {
        return true;
    }
}
