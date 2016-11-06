var log = require('npmlog');

module.exports = {
    title: 'Log-in',
    type: 'page',

    mapping: {
        "/logout" : function(req, res) {

            res.cookie('uid', 0, { expires: new Date(Date.now() - 9) });

            return res.render("user_logout", req.data);
        }

    }
};
