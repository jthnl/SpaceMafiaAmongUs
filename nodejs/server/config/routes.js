/**
 * routes.js
 * 
 * Routes for managing HTTP requests and other routing.
 * 
 * TODO: Hash and encrypt user password before inserting
 */

const passport = require('passport');

module.exports = function (app, db) {

    app.route('/').get((req, res) => {
        res.redirect('/login');
    });

    app.route('/login/auth').post(passport.authenticate('local', { failureRedirect: '/lol' }), (req, res) => {
        console.log("authenticated");
        res.redirect('/working');
    });

    app.route('/register').post(
        (req, res, next) => {
            db.findOne({ username: req.body.username }, function (err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    res.redirect('/');
                } else {
                    db.insertOne({ username: req.body.username, password: req.body.password }, (err, doc) => {
                        if (err) {
                            console.log(console.error());
                            res.redirect('/');
                        } else {
                            console.log(doc.ops[0]);
                            next(null, doc.ops[0]);
                        }
                    });
                }
            });
        },
        passport.authenticate('local', { failureRedirect: '/' }),
        (req, res, next) => {
            res.redirect('/game');
        }
    );

};


function registerUser(req, res, next){

}