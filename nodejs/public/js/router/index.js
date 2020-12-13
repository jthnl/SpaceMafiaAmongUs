import httpVueLoader from '/web_modules/http-vue-loader/src/httpVueLoader.js'

var Login = httpVueLoader('js/views/Login.vue');
var Register = httpVueLoader('js/views/Register.vue');
var Account = httpVueLoader('js/views/Account.vue');
var Lobby = httpVueLoader('js/views/Lobby.vue');
var Room = httpVueLoader('js/views/Room.vue');
var Admin = httpVueLoader('js/views/Admin.vue');

var routes = [{
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/account',
        name: 'account',
        component: Account
    },
    {
        path: '/lobby',
        name: 'lobby',
        component: Lobby
    },
    {
        path: '/room',
        name: 'room',
        component: Room
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin
    }
];

var router = new VueRouter({
    routes: routes
});

export default router