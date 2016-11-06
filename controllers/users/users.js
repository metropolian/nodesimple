var log = require('npmlog');

module.exports = {
    title: 'User Management',
    type: 'datatable',

    fields: {
       user_id: {
           type: 'int', required: true, auto: true,
           title: 'ID' },

       username: {
           type: 'string',
           title: 'Username' },

       user_title: {
           type: 'string',
           title: 'Title' },

       user_type: {
           type: 'string',
           title: 'Type' },

       accessed_time: {
           type: 'datetime',
           title: 'Last Access' },

       status: {
           type: 'string',
           title: 'Status',
           options: { } }
    },

    data: [
    ],

    mapping: {
        "/admin/users" : function(req, res) {

            req.app.locals.db.query("SELECT * FROM users", function(err, rows) {

                if (!err) {

                    req.data.data = rows;
                    log.info('data', rows);
                    res.render("datatable", req.data);

                } else {

                    req.data.error = err;
                    res.render("error", req.data);
                }

            });

        },

        "/admin/users/:func/:page" : function(req, res) {

            //req.data.title = 'hellos';
            res.render("datatable", req.data);
        }
    }
};
