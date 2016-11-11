var log = require("npmlog");
var util = require('util');

function Database( configs ) {

    this.type = configs.type || 'mysql';

    var DataAdapter = require('./databases/' + this.type + '.js');

    this.adapter = new DataAdapter( configs );

}


module.exports = Database;

Database.prototype.execute = function(q, cb) {
    return this.adapter.execute(q, cb);
}

Database.prototype.query = function(q, cb) {
    return this.adapter.query(q, cb);
}

Database.prototype.where = function( conds ) {
    if (typeof conds === 'string') {
        if (conds.toLowerCase().indexOf("WHERE") < 0) {
            return "WHERE " + conds;
        }
        return conds;
    }
    var q = "";
    var vs = [];
    for(var key in conds) {
        var value = this.adapter.valueOf(conds[key]);
        vs.push( "(" + key + "=" + this.adapter.sanitize( value ) + ")" );
    }
    if (vs.length > 0) {
        q += "WHERE " + vs.join(' AND ');
    }
    return q;
};


Database.prototype.createTable = function( tb, struct, cb ) {
    var q = "CREATE TABLE IF NOT EXISTS " + tb + " ";
    var fields = []
    for(var n in struct) {
        var f = "";
        var s = struct[n];
        var t = s.type.toUpperCase();
        switch(t) {
            case "STRING": t = "VARCHAR"; break;
            case "INT": t = "INTEGER"; break;
        }
        if (t == "VARCHAR")
            t += "(" + s.length + ")";
        f = n + " " + t + " ";
        if (s.primary || s.primaryKey) {
            f += "PRIMARY KEY AUTO_INCREMENT"
            // sqlite uses AUTO_INCREMENT
            // mysql uses AUTO_INCREMENT
        } else {
            f += (s.required) ? "NOT NULL" : "NULL";
        }
        fields.push(f);
    }
    q += "(" + fields.join() + ")"

    this.execute(q, cb);
};

Database.prototype.deleteTable = function( tb, cb ) {
    var q = "DROP TABLE " + tb;
    return this.execute(q, function(err, results) {
        cb(err, results);
    });
};

Database.prototype.selectTable = function( columns, tb, conds, cb ) {
    var q = "SELECT " + columns + " FROM " + tb + " " + this.where(conds);
    return this.query(q, function(err, results) {
        if (err) {
            cb(err, null);
        } else {
            cb(err, results);
        }
    });
};


Database.prototype.selectRow = function( columns, tb, conds, cb ) {
    var q = "SELECT " + columns + " FROM " + tb + " " + this.where(conds) + " LIMIT 1";

    return this.query(q, function(err, results) {
        if (err) {
            cb(err, null);
        } else {
            cb(err, results[0]);
        }
    });
};

Database.prototype.insert = function( tb, data, cb ) {

    var q = "INSERT INTO " + tb ;
    var f = [];
    var v = [];
    for(var key in data) {
        var value = this.adapter.valueOf(data[key]);
        f.push(key);
        v.push(this.adapter.sanitize( value ) );
    }
    q += "(" + f.join(',') + ") ";
    q += "VALUES (" + v.join(',') + ")";
    return this.execute( q, cb );
};

Database.prototype.update = function( tb, data, conds, cb ) {

    var q = "UPDATE " + tb + " SET ";
    var vs = [];
    for(var key in data) {
        var value = this.adapter.valueOf(data[key]);
        vs.push( key + "=" + this.adapter.sanitize( value ) );
    }
    q += vs.join(', ');
    q += " " + this.where(conds);

    return this.execute( q, cb );
};

Database.prototype.delete = function( tb, conds, cb ) {
    var q = "DELETE FROM " +  tb + " " + this.where(conds);

    return this.execute( q, cb );
};
