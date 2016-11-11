var users = {};

module.exports = function(app, db) {
    
    return {
        authx: function (data, cb) {

            if (users[uid]) {

                if (users[uid].access_token == utoken) {

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

        }

    }
};
