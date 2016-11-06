module.exports = {

    default: {

        mainmenu: [
            { href: "/", title: "Dashboard" },
            { href: "/table", title: "Table" },
            { href: "/users", title: "Users" }
        ],

        pages: {

            dashboard: {
                type: 'dashboard',
                title: 'Dashboard',
                mapping: {
                    "/": function(req, res) {
                        res.render('dashboard', req.data);
                    },
                }
            },

            table: require('./controllers/table.js'),

            /*
            users: {
                path: '/users',
                title: 'Users',
                type: 'datatable',
                data: 'users',
                actions: ['add', 'edit', 'delete'],

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
                }
            },

            */

            personalize: require('./controllers/users/personalize.js'),
            login: require('./controllers/users/login.js'),
            logout: require('./controllers/users/logout.js'),
            register: require('./controllers/users/register.js'),
            recovery: require('./controllers/users/recovery.js'),

            admin_users: require('./controllers/users/users.js')
        }
    }
};
