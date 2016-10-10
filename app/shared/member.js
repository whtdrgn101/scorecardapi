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
    getLifetimeStats: function(id) {
        let query = 
        `SELECT 
            COUNT(DISTINCT r.id) total_rounds
            , MAX(total_score) highest_round
            , MIN(total_score) lowest_round
            , AVG(total_score) average_round
            , MAX(end_score) highest_end
            , MIN(end_score) lowest_end
            , AVG(end_score) average_end
            , AVG(end_score/arrow_count) average_point_per_arrow 
            FROM round r 
            INNER JOIN end e ON (r.id = e.round_id) 
            WHERE r.member_id = ?
            GROUP BY r.member_id`;
        return new P(function(resolve, reject){
            console.log(query);
            console.log(id);
            connection.query(query, id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                if(rows.length > 0)
                    resolve(rows[0]);
                else
                    resolve({});
            });    
        });
    },
    getLast30DayStats: function(id) {
        let query = 
        `SELECT 
            COUNT(DISTINCT r.id) total_rounds
            , MAX(total_score) highest_round
            , MIN(total_score) lowest_round
            , AVG(total_score) average_round
            , MAX(end_score) highest_end
            , MIN(end_score) lowest_end
            , AVG(end_score) average_end
            , AVG(end_score/arrow_count) average_point_per_arrow 
            FROM round r 
            INNER JOIN end e ON (r.id = e.round_id) 
            WHERE r.member_id = ? AND r.round_date > DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY r.member_id`;
        return new P(function(resolve, reject){
            connection.query(query, id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                if(rows.length > 0)
                    resolve(rows[0]);
                else
                    resolve({});
            });    
        });
    },
    getLastRoundStats: function(id) {
        let query = 
        `SELECT 
            r.*
            , MAX(end_score) highest_end
            , MIN(end_score) lowest_end
            , AVG(end_score) average_end
            , AVG(end_score/arrow_count) average_point_per_arrow 
            FROM round r 
            INNER JOIN end e ON (r.id = e.round_id) 
            WHERE r.member_id = ?
            GROUP BY r.member_id
            HAVING r.round_date = MAX(r.round_date)
            LIMIT 1`;
        return new P(function(resolve, reject){
            connection.query(query, id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
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
