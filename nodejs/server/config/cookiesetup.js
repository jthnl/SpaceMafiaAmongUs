/**
 * cookiesetup.js
 * 
 * Setup Express-Session/Passport-SocketIO Cookies 
 * 
 * ********* IMPORTANT NOTE!!! *********** 
 * This is currently not secure to deploy publicly,
 * but should be good enough for testing purposes
 * Future TODOs: 
 *  - Encrypt password (salt + hash) - bcrypt?
 *  - Change Session-secret: https://martinfowler.com/articles/session-secret.html
 *  - Change configurations: ex: resave, saveUnitialized -> false
 */

// external modules
const session = require('express-session');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');

// MongoDB - datastore for cookies
const MongoStore = require('connect-mongo')(session);
const store = new MongoStore({ url: process.env.DB_STORE_URI + process.env.DB_STORE_NAME});

module.exports = function(app, io){

    // set express-session cookies
    app.use(session({
        secret: "temp-secret-string",   
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
        key: 'spacemafia.sid',
        store: store
    }));

    // set socket-io cookie
    io.use(
        passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'spacemafia.sid',
        secret: "temp-secret-string", 
        store: store,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
        })
    );

    // socket io - cookie authorized 
    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');
        accept(null, true);
    }
    
    // socket io - cookie fail 
    function onAuthorizeFail(data, message, error, accept) {
        if (error) throw new Error(message);
        console.log('failed connection to socket.io:', message);
        accept(null, false);
    }

}