import httpVueLoader from '/web_modules/http-vue-loader/src/httpVueLoader.js'

var Login = httpVueLoader('js/views/Login.vue');
var Lobby = httpVueLoader('js/views/Lobby.vue');
var Register = httpVueLoader('js/views/Register.vue');

var routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/lobby',
    name: 'lobby',
    component: Lobby
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
];

var router = new VueRouter({
  routes: routes
});

export default router