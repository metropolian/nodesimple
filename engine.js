var log = require('npmlog');

module.exports = function(req, res) {
    var locals = req.app.locals;
    var inputs = req.inputs = req.body;
    var type = req.page.type;

    log.info("locals", locals);

    req.data =
    {
        app_name: locals.app_name,
        page: req.page,
        user: null,
        errors: null,

        title: req.page.title,
        body: '',
        mainmenu: req.page.menus
    };

    log.info("req-type", type);

    if (req.cookies.uid) {

        if (type == "logout") {
            res.cookie('uid', 0, { expires: new Date(Date.now() - 9) });

        } else {

            req.data.user = { user_id: 1, username: 'admin' };

        }

    }

    if (typeof req.renderer == 'function')
        return req.renderer(req, res);

    res.send(req.path + ' no renderer');
    //return res.render(view, contents);
    //res.end();
    //res.send(req.path + ":" + path + " " + section.title);
}
