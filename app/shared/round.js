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
    createRound: function(round) {
        return new P(function(resolve, reject){
            var r = {
                bow_id: round.bow_id,
                member_id: round.member_id,
                total_score: round.total_score,
                round_type: round.round_type,
                round_date: round.round_date
            };
            var ends = round.ends;
            
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                connection.query('INSERT INTO round SET ?', r, function(err, result) {
                    if(err) {
                        return connection.rollback(function() {
                          reject(err);
                        });
                    }
                    round.id = result.insertId;
                    if(ends) {
                        ends.forEach(e => {
                            e.round_id = round.id;
                            connection.query('INSERT INTO end SET ?', e, function(err, result){
                              if(err) {
                                return connection.rollback(function() {
                                  reject(err);
                                });    
                              }
                              e.id = result.insertId;
                           }); 
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                          return connection.rollback(function() {
                            reject(err);
                          });
                        }
                        resolve(round);
                    });
                });    
            });
        });
    },
    updateRound: function(round) {
        return new P(function(resolve, reject){
            var r = {
                id: round.id,
                bow_id: round.bow_id,
                member_id: round.member_id,
                total_score: round.total_score,
                round_type: round.round_type,
                round_date: round.round_date
            };
            var ends = round.ends;
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                connection.query('UPDATE round SET ? WHERE id=?', [r, r.id], function(err, result) {
                    if(err) {
                        return connection.rollback(function() {
                          reject(err);
                        });
                    }
                    if(ends) {
                        ends.forEach(e => {
                            
                            e.round_id = round.id;
                            
                            if(e.id) {
                                connection.query('UPDATE end SET ? WHERE id=?', [e, e.id], function(err, result){
                                    if(err) {
                                        return connection.rollback(function() {
                                            reject(err);
                                        });    
                                    }
                                });
                            } else {
                                connection.query('INSERT INTO end SET ?', e, function(err, result){
                                    if(err) {
                                        return connection.rollback(function() {
                                            reject(err);
                                        });    
                                    }
                                });
                            }
                             
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                          return connection.rollback(function() {
                            reject(err);
                          });
                        }
                        resolve(round);
                    });
                });    
            });  
        });
    },
    getRound: function(id) {
        return new P(function(resolve, reject){
            connection.query('SELECT * FROM round WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                } else {
                    var round = rows[0];
                    connection.query('SELECT * FROM end WHERE round_id=?', id, function(err, ends){
                        if(err) {
                            reject(err);
                            return;
                        }
                        round.ends = ends;
                        resolve(round);
                        return;
                    });
                }
            });    
        });
    },
    getMemberRounds: function(member_id) {
        return new P(function(resolve, reject){
            console.log(member_id);
            connection.query(
            `SELECT 
                r.*
                , rt.name round_type_name 
                , b.name bow_name
            FROM round r 
            INNER JOIN round_type rt ON (r.round_type = rt.id) 
            INNER JOIN bow b ON (r.bow_id = b.id) 
            WHERE r.member_id=? 
            ORDER BY round_date DESC`, member_id, function(err, rows) {
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
            connection.query('SELECT * FROM round_type', function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    },
    deleteRound: function(id) {
        return new P(function(resolve, reject){
            //DELETE on round will cascade to `end` records as well
            connection.query('DELETE FROM round WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    }
}
