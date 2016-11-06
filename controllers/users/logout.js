var log = require('npmlog');

module.exports = {
    title: 'Log-out',
    type: 'page',

    mapping: {
        "/logout" : function(req, res) {

            res.cookie('uid', 0, { expires: new Date(Date.now() - 9) });
            res.cookie('utoken', 0, { expires: new Date(Date.now() - 9) });
            req.data.user = null;

            return res.render("user_logout", req.data);
        }

    }
};
