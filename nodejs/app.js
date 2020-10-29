/**
 * SpaceMafiaAmongUs
 * 
 * Starting point for the server.  
 */

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let port = 3003;

// application will send everything in ./public to clients
app.use(express.static("public"));

// wait for clients on port
http.listen(port, () => {
    console.log("Listening on port: " + port);
});

// socket io
io.on('connection', (socket) => {

    // when client connects, greet hello!
    socket.emit("helloClient", "Hello Client!"); // TODO: change "Hello Client!" to a JSON datastructure for more complex tasks 

    // when socket recieves "helloServer" from client, capitalize message and send it back to client
    socket.on('helloServer', (data) =>{
        console.log("user says: " + data);
        data = data.toUpperCase();
        socket.emit('helloClient', "You said: " + data);
    });

    // when socket recieves "helloServer" from client, capitalize message and send it back to client
    socket.on('bye', (data) =>{
        console.log("user says: " + data);
        // TODO: remove user from active clients
    });

});