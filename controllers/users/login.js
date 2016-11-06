var log = require('npmlog');

module.exports = {
    title: 'Log-in',
    type: 'page',

    mapping: {
        "/login" : function(req, res) {

            if ((req.inputs.username != '') && (req.inputs.password != '')) {
                res.cookie('uid', 1, { expires: new Date(Date.now() + 900000) });
                res.redirect('/');
                return;
            }
            return res.render("user_login", req.data);
        },

        "/login/success" : function(req, res) {

            return res.render("user_login_done", req.data);
        }
    }
};
