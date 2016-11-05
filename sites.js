module.exports = {

    default: {

        mainmenu: [
            { href: "/", title: "Dashboard" },
            { href: "/users", title: "Users" },
        ],

        pages: {

            dashboard: {
                title: 'Dashboard',
                type: 'dashboard'
            },

            users: {
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


            login: {
                title: 'Login',
                type: 'login',
                view: 'user_login'
            },

            logout: {
                title: 'Logout',
                type: 'logout',
                view: 'user_logout'
            },

            register: {
                title: 'Logout',
                type: 'logout',
                view: 'user_register'
            },

            recovery: {
                title: 'Recovery Password',
                type: 'recovery',
                view: 'user_recovery'
            },

        }
    }
};
