var log = require('npmlog');
var express = require('express');
var server = express();
var cookie_parser = require('cookie-parser');
var fs = require('fs');
var ejs = require('ejs');
var db = require('./database.js');
var clone = require('clone');

db.connect({
    host      : 'localhost',
    port      : 3306,
    user      : 'root',
    password  : 'drmg',
    database  : 'sm',

    // Optional
    charset   : 'utf8',
    collation : 'utf8_general_ci'
});

/*
db.query('SELECT * FROM users', function(err, rows) {
    log.info('rows', rows);
}); */
 /*
db.insert('users', { username: 'admin', password: '1234'}, function(error, rows) {

    log.info('res', rows);
});

*/

/*
db.update('users',
    { username: 'yaysa', password: 'gaga', email: 'dodo', flags: 1 },
    "user_id = 3",
    function(err, results) {
        log.info('res', results);
        log.error('res', err);
    } );
*/

ejs.renderFileSync = function( fname, opts ) {
    return ejs.renderFile('views/base.ejs', { body: {} }, function(err, str) { return str; });
};

process.chdir(__dirname);

var structures = {

    dashboard: {

    },

    users: {
        title: 'Users',
        type: 'datatable',
        data: 'users',
        actions: ['add', 'edit', 'delete'],

        fields: {
            user_id: {
                type: 'int', required: true, auto: true,
                title: 'ID' },

            name: {
                type: 'string',
                title: 'Name' },

            password: {
                type: 'password',
                title: 'Password' },

            email: {
                type: 'email',
                title: 'Email' },

            status: {
                type: 'string',
                title: 'Status',
                options: { } }
        }
    }



}



server.set('view engine', 'ejs');
server.set('views', process.cwd());
server.use(cookie_parser());
server.use(express.static('public'));


for(var name in structures) {
    var n = name;
    var section = clone(structures[name]);

    server.get('/' + name, function(req, res) {

        res.send(section.title);
    });
}

/*
server.use(function(req, res, next) {

    //ejs.compile(String(fs.readFileSync('public/base.ejs')), {} );
    //res.send(  );

    //console.log(req.path);

    var fname = server.get('views') + req.path;
    console.log(fname);

    if (fs.existsSync(fname)) {
        var raw = String(fs.readFileSync(fname, {}));


        //ejs.renderFile('views/base.ejs', { body: {} }, function(err, str) { res.end(str) });

        res.end( ejs.render(raw, {filename: fname, strict: false}) );

    }

    next();
});
*/

server.listen(8080);
