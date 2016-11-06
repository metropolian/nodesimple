var log = require('npmlog');

module.exports = {
    title: 'Table',
    type: 'datatable',

    fields: {
       user_id: {
           type: 'int', required: true, auto: true,
           title: 'ID' },

       name: {
           type: 'string',
           title: 'Name' },

       password: {
           type: 'password',
           title: 'Password' },

       email: {
           type: 'email',
           title: 'Email' },

       status: {
           type: 'string',
           title: 'Status',
           options: { } }
    },

    data: [
    ],

    mapping: {
        "/data" : function(req, res) {

            log.info('data', req.data);
            res.render("datatable", req.data);
        },

        "/data/:func/:page" : function(req, res) {

            //req.data.title = 'hellos';
            res.render("datatable", req.data);
        }
    }
};
