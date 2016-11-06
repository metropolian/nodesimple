var log = require('npmlog');
var promise = require('bluebird');
var crypto = require('crypto');

function encrypt_user_password(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function encrypt_access_token(user) {
    return crypto.createHmac('sha256', user.username).update(new Date().toString()).digest('hex');
}

module.exports = {
    title: 'Log-in',
    type: 'page',

    mapping: {
        "/login" : function(req, res) {
            var db = req.app.locals.db;

            if (req.method == "POST") {
                var username = req.inputs.username;
                var password = encrypt_user_password( req.inputs.password );

                log.info("pwd", password);

                db.selectRow("*", "users", { username: username, password: password }, function(err, row){

                    log.info("user", row);
                    if (!err) {
                        if (row) {
                            var user = req.data.user = row;
                            var access_token = encrypt_access_token(user);

                            db.update("users",
                                { access_token: access_token, access_token_time: new Date(), accessed_time: new Date() },
                                { user_id: user.user_id },
                                function(err, results) {
                                    if (!err) {

                                        res.cookie('uid', user.user_id , { expires: new Date(Date.now() + 900000) });
                                        res.cookie('utoken', access_token , { expires: new Date(Date.now() + 900000) });
                                        res.redirect('/');

                                    } else {

                                        req.data.error = err;
                                        return res.render("user_login", req.data);
                                    }

                                });

                            return;

                        } else {
                            req.data.error = new Error('Invalid username or password!');

                        }

                    } else { // error
                        req.data.error = err;
                    }

                    res.render("user_login", req.data);

                });

                return;

            }
            return res.render("user_login", req.data);
        },

        "/login/success" : function(req, res) {

            return res.render("user_login_done", req.data);
        }
    }
};
