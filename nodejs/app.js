/**
 * SpaceMafiaAmongUs
 * 
 * Starting point for the server.  
 */

'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT_NODE;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = require('./server/database/mongoconn');
const routes = require('./server/config/routes');
const cookiesetup = require('./server/config/cookiesetup');
const passportsetup = require('./server/config/passportsetup');

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

db(async (client) => {
    const dbm = await client.db(process.env.DB_NAME).collection(process.env.DB_USER);

    cookiesetup(app, io, dbm, passport);
    passportsetup(app, dbm, passport);
    routes(app, dbm);

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
}).catch((e) => {
    console.log("Unable to connect to db. F");
});

// wait for clients on port
http.listen(port, () => {
    console.log("Listening on port : " + port);
});