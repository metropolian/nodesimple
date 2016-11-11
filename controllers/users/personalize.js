var log = require('npmlog');
var promise = require('bluebird');

module.exports = {
    title: 'User Register',
    type: 'page',

    mapping: {
        "/personalize" : function(req, res) {

            if (req.method == "POST") {
                var user_id = req.data.user.user_id;
                var newdata = {
                    user_title: req.inputs.title,
                    user_email: req.inputs.email,
                    first_name: req.inputs.first_name,
                    last_name: req.inputs.last_name,
                    address: req.inputs.address,
                    telephone: req.inputs.telephone
                };

                //log.info('input', req.inputs);

                new promise(function(resolve,reject){

                    req.app.locals.db.update("users", newdata, { user_id: user_id}, function(err, results) {

                        if (!err) {

                            delete req.app.locals.users[user_id];
                            req.app.locals.db.selectRow("*", "users", { user_id: user_id}, function(err, row) {

                                if (row) {
                                    var user_id = row.user_id;
                                    if (user_id > 0) {

                                        req.app.locals.users[row.user_id] = row;
                                        req.data.user = row;

                                        log.info('user', req.data.user);
                                        resolve();
                                    } else {
                                        reject()
                                    }
                                } else {
                                    reject();
                                }
                            });

                        } else {
                            reject();
                        }
                    } );

                }).then(function(resolve){

                    return res.render("user_personalize", req.data);

                }).catch(function(resolve){

                });

                return;
            }

            return res.render("user_personalize", req.data);
        },

        "/personalize/success" : function(req, res) {

            return res.render("user_personalize_done", req.data);
        }
    }
};
