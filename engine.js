var log = require('npmlog');
var Promise = require('bluebird');
var users = require('./models/users.js');

module.exports = function(req, res) {
    var locals = req.app.locals;
    var inputs = req.inputs = req.body;
    var type = req.page.type;

    req.data =
    {
        app_name: locals.app_name,
        page: req.page,
        user: null,
        error: null,

        title: req.page.title,
        body: '',
        mainmenu: req.page.menus
    };

    req.data.user = null;

    new Promise(function(resolve) {

        if (req.cookies.uid && req.cookies.utoken) {
            var uid = req.cookies.uid;
            var utoken = req.cookies.utoken;

            if (req.app.locals.users[uid]) {

                if (req.app.locals.users[uid].access_token == utoken) {

                    req.data.user = req.app.locals.users[uid];
                    resolve();
                    return;
                }
            }

            req.app.locals.db.selectRow("*", "users", {access_token: utoken}, function(err, row) {

                if (row) {
                    var user_id = row.user_id;
                    if (user_id > 0) {

                        req.app.locals.users[row.user_id] = row;
                        req.data.user = row;

                        log.info('user', req.data.user);
                    }
                }

                resolve();
            });

        } else {

            resolve();
        }


    }).then(function() {

        if (typeof req.renderer == 'function')
            return req.renderer(req, res);

        res.send(req.path + ' no renderer');

    });


    //return res.render(view, contents);
    //res.end();
    //res.send(req.path + ":" + path + " " + section.title);
}
