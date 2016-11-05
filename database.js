var mysql = require('mysql');
var sanitize = mysql.escape;

var db = module.exports;

var connection = {};

db.connect = function( opts ) {
    connection = mysql.createPool( opts );
    return connection;
};

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
        var value = conds[key].toString();
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
        var value = data[key].toString();
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
        var value = data[key].toString();
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
