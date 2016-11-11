var async = require('async');
var log = require('npmlog');
var Database = require('./library/database.js');

var db = new Database({
    type      : 'mysql',

    host      : 'localhost',
    port      : 3306,
    user      : 'root',
    password  : 'drmg',
    database  : 'sm',

    // Optional
    charset   : 'utf8',
    collation : 'utf8_general_ci'
});


var db2 = new Database({
    type      : 'sqlite3',
    filename  : 'localdb'
});

log.info('db', Database.prototype);



    /*
    db.deleteTable('test', function(err, rows) {
        log.info('rows', rows);
        log.error('errors', err);
    });
*/
async.series([
    function(next) {

        db.createTable('test', {
            user_id: { type: 'int', primaryKey: true },
            name: { type: 'string', length: 200 },
            flags: { type: 'int', length: 200 }
        }, function(err, rows) {
            log.info('rows', rows);
            log.error('errors', err);

            next();
        });

    },

    function(next) {

        for(var i = 0; i < 10; i++) {
            db.insert('test', {
                name: "\'" + Math.random().toString() + "\'"
            }, function(err, rows) {
                log.info('rows', rows);
                log.error('errors', err);
            });
        }

        setTimeout(next, 1000);


    },


    function(next) {

        db.selectTable('*', 'test', {}, function(err, rows) {
            log.info('rows', rows);
            log.error('errors', err);
        });



    },


    function(next) {

        process.exit();
        next();
    }

]);






/*
    db.update('test', { name: '11111', flags: '`flags`+1' }, { user_id: 5 }, function(err, results) {
        log.info('rows', results);
        log.error('errors', err);
       });
*/

/*
    db.selectTable('*', 'test', {}, function(err, rows) {
        log.info('rows', rows);
        log.error('errors', err);

        async.each(rows, function(r) {

            db.update('test', { flags: r.user_id + 1 }, { user_id: r.user_id }, function(err, results) {

            });
        });
    });
*/
/*
db.delete('test', { user_id: 8 }, function (err, rows) {
    log.info('rows', rows);
    log.error('errors', err);

});
*/

/*
    db.query("CREATE TABLE MyGuests ( \
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
    firstname VARCHAR(30) NOT NULL, \
    lastname VARCHAR(30) NOT NULL, \
    email VARCHAR(50), \
    reg_date TIMESTAMP \
    ) ", function(err, rows) {
        log.info('rows', rows);
        log.error('errors', err);
    });
    /*
    db.query('SELECT * FROM users LIMIT 1', function(err, rows) {
        log.info('rows', rows);
    }); */
