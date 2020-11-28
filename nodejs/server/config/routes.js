/**
 * routes.js
 * 
 * Routes for managing HTTP requests and other routing.
 * 
 * TODO: Hash and encrypt user password before inserting
 */

const passport = require('passport');

module.exports = function (app, db) {

    app.post('/login',
        passport.authenticate('local', { failWithError: true }),
        function (req, res, next) {
            res.json({
                "username": req.body.username,
                "success": true
            });
        },
        function (err, req, res, next) {
            res.json({
                "username": req.body.username,
                "success": false
            });
        }
    );

    app.route('/register').post(
        (req, res, next) => {
            db.findOne({ username: req.body.username }, function (err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    res.json({
                        "username": req.body.username,
                        "success": false
                    });
                } else {
                    db.insertOne({ username: req.body.username, password: req.body.password }, (err, doc) => {
                        if (err) {
                            console.log(console.error());
                            res.json({
                                "username": req.body.username,
                                "success": false
                            });
                        } else {
                            console.log(doc.ops[0]);
                            next(null, doc.ops[0]);
                        }
                    });
                }
            });
        },
        passport.authenticate('local', { failWithError: true }),
        function (req, res, next) {
            res.json({
                "username": req.body.username,
                "success": true
            });
        },
        function (err, req, res, next) {
            res.json({
                "username": req.body.username,
                "success": false
            });
        }
    );

};

