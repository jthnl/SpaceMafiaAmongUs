let socket = io();
let vue = new Vue({
    el: '#app',
    
    data: {
        message: "",
        reply: "",
    },
    
    created(){
        // send bye when window closed
        window.onbeforeunload = () => {
            socket.emit("bye", "user says bye");
        }

        // wait for server to send helloClient
        socket.on('helloClient', (data) => {
            this.reply = data;
        });
    },

    watch:{

    },

    methods:{

        // send helloServer to server
        sendHelloWorld(){
            socket.emit('helloServer', this.message);
            this.message = null;
        }

    }

});