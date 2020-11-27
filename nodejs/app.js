/**
 * SpaceMafiaAmongUs
 * 
 * Starting point for the server.  
 */

 'use strict';

let express = require('express');
let session = require('express-session');
const { allowedNodeEnvironmentFlags } = require('process');

let app = express();

let http = require('http').Server(app);
//let io = require('socket.io')(http);

let port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Note: Change session options before actually deploying to the public. 
 * https://martinfowler.com/articles/session-secret.html
 */
app.use(session({
    secret: "temp-secret-string",   
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },  //remove domain
    key: 'spacemafia.sid',
}));

// Test Express Session
app.get('/test', (req, res, next) => {
    console.log("router");
    console.log(req.session);
    console.log(req.session.key++);
    res.send('helloSession');
});


// // socket io
// io.on('connection', (socket) => {

//     // when client connects, greet hello!
//     socket.emit("helloClient", "Hello Client!"); // TODO: change "Hello Client!" to a JSON datastructure for more complex tasks 

//     // when socket recieves "helloServer" from client, capitalize message and send it back to client
//     socket.on('helloServer', (data) =>{
//         console.log("user says: " + data);
//         data = data.toUpperCase();
//         socket.emit('helloClient', "You said: " + data);
//     });

//     // when socket recieves "helloServer" from client, capitalize message and send it back to client
//     socket.on('bye', (data) =>{
//         console.log("user says: " + data);
//         // TODO: remove user from active clients
//     });

// });

// wait for clients on port
http.listen(port, () => {
    console.log("Listening on port : " + port);
});