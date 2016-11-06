module.exports = {
    title: 'User Register',
    type: 'page',

    mapping: {
        "/register" : function(req, res) {

            if (req.method == "POST") {
                if ((req.inputs.username != '') && (req.inputs.password != '')) {
                    res.cookie('uid', 1, { expires: new Date(Date.now() + 900000) });
                    res.redirect('/');
                    return;
                }
            }
            return res.render("user_register", req.data);
        },

        "/register/success" : function(req, res) {

            return res.render("user_register_done", req.data);
        }
    }
};
