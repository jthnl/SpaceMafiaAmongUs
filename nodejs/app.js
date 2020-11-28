/**
 * SpaceMafiaAmongUs
 * 
 * Server Code for SpaceMafiaAmongUs  
 */

'use strict';

// external modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passport = require('passport');

const port = process.env.PORT_NODE;

// local modules
const db = require('./server/database/mongoconn');                  // connection to mongo
const routes = require('./server/config/routes');                   // HTTP routes
const cookiesetup = require('./server/config/cookiesetup');         // setup cookies for Passport and SocketIO
const passportsetup = require('./server/config/passportsetup');     // setup Passport

// set express middlewear
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// initialize passport JS 
app.use(passport.initialize());
app.use(passport.session());

db(async (client) => {
    const dbm = await client.db(process.env.DB_NAME).collection(process.env.DB_USER);

    // run modules 
    cookiesetup(app, io, dbm, passport);         // setup Cookies for Passport and SocketIO
    passportsetup(app, dbm, passport);           // setup Passport
    routes(app, dbm);                            // HTTP routes

    // wait for socket io connection. 
    // NOTE: Connection will be refused if client is not authenticated (see ./server/config/cookiesetup)
    io.on('connection', (socket) => {

        // SOCKET IO TESTS - TODO: CHANGE THIS --
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
        // -- END OF SOCKET IO TESTS

    });
}).catch((e) => {
    console.log("Unable to connect to db. F");
});

// listen on port
http.listen(port, () => {
    console.log("Listening on port : " + port);
});