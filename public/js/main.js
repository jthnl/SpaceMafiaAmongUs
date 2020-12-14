import httpVueLoader from '/web_modules/http-vue-loader/src/httpVueLoader.js';
import VueSocketIO from '/web_modules/vue-socket.io/dist/vue-socketio.js'
import SocketIO from '/web_modules/socket.io-client/dist/socket.io.js'

console.log("main.js");

var App = httpVueLoader('js/App.vue');
import router from './router/index.js'

Vue.use(
    new VueSocketIO({
        debug: true,
        connection: SocketIO("/", {
            autoConnect: false
        }),

    })
);

new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');