var log = require('npmlog');
var mysql = require('mysql');

function MysqlDataAdapter( opts ) {

    this.sanitize = mysql.escape;
    this.connection = {};
    this.connect( opts );

}

module.exports = MysqlDataAdapter;

MysqlDataAdapter.prototype.connect = function( opts ) {
    this.connection = mysql.createPool( opts );
    return this.connection;
};

MysqlDataAdapter.prototype.valueOf = function( value ) {
    if (value instanceof Date) {
        function twoDigits(d) {
            if(0 <= d && d < 10) return "0" + d.toString();
            if(-10 < d && d < 0) return "-0" + (-1*d).toString();
            return d.toString();
        }
        return value.getUTCFullYear() + "-" + twoDigits(1 + value.getUTCMonth()) + "-" + twoDigits(value.getUTCDate()) + " " + twoDigits(value.getUTCHours()) + ":" + twoDigits(value.getUTCMinutes()) + ":" + twoDigits(value.getUTCSeconds());
    }
    if (value)
        return value.toString();
    return value;
};

MysqlDataAdapter.prototype.query = function( q, cb ) {
    this.connection.getConnection(function(err, link) {
        if (err) {
            cb(err, null);
        } else {
            link.query( q, function(err, results) {
                log.info('sql', q);
                link.release();
                if (results)
                    results.query = q;
                if (!err) {
                    if (results.insertId) {
                        results.id = results.insertId;
                        results.count = 1;
                    } else {
                        results.count = results.affectedRows;
                    }
                }
                cb(err, results);
            });
        }
    });
    return true;
};

MysqlDataAdapter.prototype.execute = MysqlDataAdapter.prototype.query;
