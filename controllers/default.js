var log = require('npmlog');

module.exports = {
    title: 'Table',
    type: 'datatable',

    fields: {},

    data: [],

    mapping: {
        "/def" : function(req, res) {
            res.render("dashboard", req.contents);
        }
    }
};
