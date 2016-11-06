module.exports = {
    title: 'User Register',
    type: 'page',

    mapping: {
        "/recovery" : function(req, res) {
            if (req.method == "POST") {

            }
            return res.render("user_recovery", req.data);
        },

        "/recovery/success" : function(req, res) {

            return res.render("user_recovery_done", req.data);
        }
    }
};
