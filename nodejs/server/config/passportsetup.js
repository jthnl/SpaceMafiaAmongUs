/**
 * passportsetup.js
 * 
 * Setup Passport JS functions
 * 
 * ********* IMPORTANT NOTE!!! *********** 
 * This is currently not secure to deploy publicly,
 * but should be good enough for testing purposes
 * Future TODOs: 
 *  - Encrypt password (salt + hash) in local strategy - bcrypt?
*/

const LocalStrategy = require('passport-local');    // local strategy
const ObjectID = require('mongodb').ObjectID;       // Mongo_OID

module.exports = function (app, db, passport) {
    
    // serialize user for cookie
    passport.serializeUser((user, done) => {
        console.log("serialize:" + user._id);
        done(null, user._id);
    });

    // deserialize user from cookie
    passport.deserializeUser((id, done) => {
        console.log("deserialize:" + id);
        db.findOne({ _id: new ObjectID(id) }, (err, doc) => {
            if (err) return console.error(err);
            done(null, doc);
        });
    });

    // local strategy - compare username-password
    passport.use(new LocalStrategy(
        function (username, password, done) {
            db.findOne({ username: username }, function (err, user) {
                console.log('Attempting Login: ' + username  + ":" + password);
                if (err) { 
                    return done(err); 
                }
                if (!user) { 
                    return done(null, false); 
                }
                if (password !== user.password) {   // TODO: Encrypt password
                     return done(null, false);
                }
                console.log("User successfully logged in");
                return done(null, user);
            });
        }
    ));

}