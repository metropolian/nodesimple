var fs = require('fs');
var log = require('npmlog');
var clone = require('clone');
var reloader = require('./reloader.js');
var promise = require('bluebird');

var express = require('express');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');
var multer  = require('multer');
var server = express();

var ejs = require('ejs');
var db = require('./database.js');
var sites = require('./sites.js');

var engine = reloader('./engine.js');

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
new promise(function(resolve) {
    db.selectRow("*", "users", { user_id: 1 }, function(err, row) {
        log.info('res', row);
        resolve();
    } );
}).then(function(){
    log.info('done', 'done');

}).catch(function(){
    log.info('done', 'done');
});

*/

//process.exit();
//return;

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

var pages = sites.default.pages;
var menus = sites.default.mainmenu;

server.locals.db = db;
server.locals.app_name = 'Simple';
server.locals.users = {};

server.set('view engine', 'ejs');
server.set('views', process.cwd() + '/views');
server.set('view options', { })
server.set('x-powered-by', false);
server.use(cookie_parser());
server.use(body_parser.json());
server.use(body_parser.urlencoded({extended: true}));
server.use(multer({ dest: './uploads/'}).any());
server.use(express.static('public'));

server.registerPath = function(path, page, renderer) {
    server.all(path, function(req, res) {
        page.app_name = 'Simple';
        page.menus = menus;
        req.page = page;
        req.renderer = renderer;

        log.http("incoming", req.ip);
        log.http("page", req.page);
        engine.handle(req, res);
    });
}

server.registerPage = function(page) {
    for(var path in page.mapping) {
        var renderer = page.mapping[path];
        log.http("register", path);

        server.registerPath(path, page, renderer);
    }
}

var pi = 0;
for(var page in pages) {
    var path = '/' + page;
    var section = clone(pages[page]);
    /*if (pi++ == 0)
        server.register('/', section); */
    server.registerPage(section);
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
