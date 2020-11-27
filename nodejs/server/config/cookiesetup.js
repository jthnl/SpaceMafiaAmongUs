const session = require('express-session');

const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');

const MongoStore = require('connect-mongo')(session);
const store = new MongoStore({ url: process.env.DB_STORE_URI + process.env.DB_STORE_NAME});

module.exports = function(app, io){

    /**
     * Note: Change session options before actually deploying to the public. 
     * https://martinfowler.com/articles/session-secret.html
     */
    app.use(session({
        secret: "temp-secret-string",   
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
        key: 'spacemafia.sid',
        store: store
    }));

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

    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');
        accept(null, true);
    }
    
    function onAuthorizeFail(data, message, error, accept) {
        if (error) throw new Error(message);
        console.log('failed connection to socket.io:', message);
        accept(null, false);
    }

}