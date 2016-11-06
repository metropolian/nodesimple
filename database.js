var log = require('npmlog');
var mysql = require('mysql');
var sanitize = mysql.escape;

var db = module.exports;

var connection = {};



db.connect = function( opts ) {
    connection = mysql.createPool( opts );
    return connection;
};

db.sqlvalue = function( value ) {
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
}


db.where = function( conds ) {
    if (typeof conds === 'string') {
        if (conds.toLowerCase().indexOf("WHERE") < 0) {
            return "WHERE " + conds;
        }
        return conds;
    }
    var q = "";
    var vs = [];
    for(var key in conds) {
        var value = db.sqlvalue(conds[key]);
        vs.push( "(" + key + "=" + sanitize( value ) + ")" );
    }
    if (vs.length > 0) {
        q += "WHERE " + vs.join(' AND ');
    }
    return q;
};

db.query = function( q, cb ) {
    connection.getConnection(function(err, link) {
        link.query( q, function(err, results) {
            log.info('sql', q);
            link.release();
            if (results)
                results.query = q;
            cb(err, results);
        });
    });
    return true;
};

db.selectRow = function( columns, tb, where, cb ) {
    var q = "SELECT " + columns + " FROM " + tb + " " + db.where(where) + " LIMIT 1";

    return db.query(q, function(err, results) {
        if (err) {
            cb(err, null);
        } else {
            cb(err, results[0]);
        }
    });
};

db.insert = function( tb, data, cb ) {

    var q = "INSERT INTO " + tb + " SET ";
    var vs = [];
    for(var key in data) {
        var value = db.sqlvalue(data[key]);
        vs.push( key + "=" + sanitize( value ) );
    }
    q += vs.join(', ');
    return db.query( q, function(err, results) {
        if (!err) {
            results.id = results.insertId;
            results.count = 1;
        }
        cb(err, results);
    });
};

db.update = function( tb, data, conds, cb ) {

    var q = "UPDATE " + tb + " SET ";
    var vs = [];
    for(var key in data) {
        var value = db.sqlvalue(data[key]);
        vs.push( key + "=" + sanitize( value ) );
    }
    q += vs.join(', ');
    q += " " + db.where(conds);

    db.query( q, function(err, results) {
        if (!err) {
            results.count = results.changedRows;
        }
        cb(err, results);
    });
};
