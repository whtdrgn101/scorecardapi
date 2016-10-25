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
            connection.query('SELECT id, email, active, password, name, created_date, location FROM member WHERE email=?', email, function(err, rows) {
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
            connection.query('SELECT id, email, active, password, name, created_date, location FROM member WHERE id=?', id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });    
        });
    },
    getMemberProfile: function(id) {
        return new P(function(resolve, reject){
            connection.query(
                `SELECT 
                    m.id
                    , m.email
                    , m.active
                    , m.password
                    , m.name
                    , m.created_date
                    , m.location
                    , TO_BASE64(m.profile_pic) profile_pic
                    , SUM(e.arrow_count) arrow_total
                FROM 
                    member m 
                INNER JOIN round r ON (r.member_id = m.id)
                INNER JOIN end e ON (e.round_id = r.id)
                WHERE m.id=?`, id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });    
        });
    },
    getLifetimeStats: function(id) {
        let query = 
        `SELECT 
            b.name bow_name
            ,rt.name round_type_name
            ,COUNT(DISTINCT r.id) total_rounds
            , MAX(total_score) highest_round
            , MIN(total_score) lowest_round
            , AVG(total_score) average_round
            , MAX(end_score) highest_end
            , MIN(end_score) lowest_end
            , AVG(end_score) average_end
            , AVG(end_score/arrow_count) average_point_per_arrow 
            FROM round r 
            INNER JOIN end e ON (r.id = e.round_id) 
            INNER JOIN bow b ON (r.bow_id = b.id) 
            INNER JOIN round_type rt ON (r.round_type = rt.id) 
            WHERE r.member_id = ?
            GROUP BY r.member_id, r.round_type, r.bow_id`;
        return new P(function(resolve, reject){
            console.log(query);
            console.log(id);
            connection.query(query, id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                if(rows.length > 0)
                    resolve(rows);
                else
                    resolve({});
            });    
        });
    },
    getLast30DayStats: function(id) {
        let query = 
        `SELECT 
            b.name bow_name
            ,rt.name round_type_name
            ,COUNT(DISTINCT r.id) total_rounds
            , MAX(total_score) highest_round
            , MIN(total_score) lowest_round
            , AVG(total_score) average_round
            , MAX(end_score) highest_end
            , MIN(end_score) lowest_end
            , AVG(end_score) average_end
            , AVG(end_score/arrow_count) average_point_per_arrow 
            FROM round r 
            INNER JOIN end e ON (r.id = e.round_id) 
            INNER JOIN bow b ON (r.bow_id = b.id) 
            INNER JOIN round_type rt ON (r.round_type = rt.id) 
            WHERE r.member_id = ? AND r.round_date > DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY r.member_id, r.round_type, r.bow_id`;
        return new P(function(resolve, reject){
            connection.query(query, id, function(err, rows) {
                if(err) {
                    reject(err);
                    return;
                }
                if(rows.length > 0)
                    resolve(rows);
                else
                    resolve({});
            });    
        });
    },
    getLastRoundStats: function(id) {
        let query = 
        `SELECT 
            r.*
            ,b.name bow_name
            ,rt.name round_type_name
            , MAX(end_score) highest_end
            , MIN(end_score) lowest_end
            , AVG(end_score) average_end
            , AVG(end_score/arrow_count) average_point_per_arrow 
            FROM round r 
            INNER JOIN end e ON (r.id = e.round_id) 
            INNER JOIN bow b ON (r.bow_id = b.id) 
            INNER JOIN round_type rt ON (r.round_type = rt.id) 
            WHERE r.member_id = ? 
            AND r.id  = (select r2.id from round r2 where r2.member_id = ? order by r2.round_date DESC LIMIT 1) 
            GROUP BY r.member_id`;
        return new P(function(resolve, reject){
            connection.query(query, [id,id], function(err, rows) {
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
