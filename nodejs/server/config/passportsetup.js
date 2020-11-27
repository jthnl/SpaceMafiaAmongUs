const LocalStrategy = require('passport-local');

const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db, passport) {

    
    passport.serializeUser((user, done) => {
        console.log("serialize:" + user._id);
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        console.log("deserialize:" + id);
        db.findOne({ _id: new ObjectID(id) }, (err, doc) => {
            if (err) return console.error(err);
            done(null, doc);
        });
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            db.findOne({ username: username }, function (err, user) {
                console.log('User ' + username + ' attempted to log in.');
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (password !== user.password) { return done(null, false); }
                console.log("successfully logged in");
                return done(null, user);
            });
        }
    ));

}