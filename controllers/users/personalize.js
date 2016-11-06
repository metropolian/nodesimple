module.exports = {
    title: 'User Register',
    type: 'page',

    mapping: {
        "/personalize" : function(req, res) {

            if (req.method == "POST") {

                
            }

            return res.render("user_personalize", req.data);
        },

        "/personalize/success" : function(req, res) {

            return res.render("user_personalize_done", req.data);
        }
    }
};
