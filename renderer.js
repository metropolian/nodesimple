var log = require('npmlog');

module.exports = function(req, res, page) {
    var locals = req.app.locals;
    var inputs = req.body;
    var type = page.type;
    var view = page.view;
    if (!view) {
        view = 'base';
    }

    log.info("locals", locals);

    var contents = {
        app_name: locals.app_name,
        title: page.title,
        body: '',
        user: null,
        mainmenu: page.menus,
        errors: null
    };

    log.info("req-type", type);

    if (req.cookies.uid) {

        if (type == "logout") {
            res.cookie('uid', 0, { expires: new Date(Date.now() - 9) });

        } else {

            contents['user'] = { user_id: 1, username: 'admin' };



        }

    } else {

        if (type == "login") {

            log.info('form', inputs);
            log.info('files', req.files);

            if (false) {
                res.cookie('uid', 1, { expires: new Date(Date.now() + 900000) });
                res.redirect('/');
                return;
            }
        }

    }

    res.render(view, contents);
    //res.end();
    //res.send(req.path + ":" + path + " " + section.title);
}
