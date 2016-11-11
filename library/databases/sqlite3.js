var log = require('npmlog');
var sqlite3 = require('sqlite3').verbose();

function Sqlite3DataAdapter( opts ) {

    this.sanitize = function(value) { return value };
    this.connection = {};
    this.connect( opts );

}

module.exports = Sqlite3DataAdapter;

Sqlite3DataAdapter.prototype.connect = function( opts ) {
    this.connection = new sqlite3.Database( opts.filename );
    return this.connection;
};

Sqlite3DataAdapter.prototype.valueOf = function( value ) {
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

Sqlite3DataAdapter.prototype.query = function( q, cb ) {

    log.info('sql', q);
    this.connection.all(q, function(err, results) {
        if (err) {
            cb(err, null);
        } else {
            cb(err, results);
        }
    });
    return true;
};

Sqlite3DataAdapter.prototype.execute = function( q, cb ) {

    log.info('sql', q);
    this.connection.run(q, function(err, results) {
        if (err) {
            cb(err, null);
        } else {
            cb(err, results);
        }
    });
    return true;
};
