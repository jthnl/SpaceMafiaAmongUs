/**
 * httpsetup.js
 * 
 * Routes for managing HTTP requests.
 * 
 * TODO: Hash and encrypt user password before inserting
 */

const passport = require('passport');

module.exports = function (app, db) {

    /**
     * Redirect to home page
     */
    app.route('/').get((req, res) => {
        res.redirect('/');
    });

    /**
     * HTTP POST: /login
     * Expects JSON Object: { username : "<username>", password : "<password>" }
     * Returns JSON Object: { username : "<username>", success : true/false, message: "<message>" }
     * 
     */
    app.post('/login',
        // attempt to authenticate passport 
        passport.authenticate('local', { failWithError: true }),
        function (req, res, next) {
            console.log(JSON.stringify(req.user));
            // if successfully authenticated, return sucess JSON object
            res.json({
                "username": req.body.username,
                "success": true,
                "message": "successfully logged in"
            });
        },
        function (err, req, res, next) {
            // if not authenticated, return fail JSON object
            res.json({
                "username": req.body.username,
                "success": false,
                "message": "incorrect login"
            });
        }
    );

    /**
     * HTTP POST: /register
     * Expects JSON Object: { username : "<username>", password : "<password>", email: "<email>", name: "<name>"}
     * Returns JSON Object: { username : "<username>", success : true/false, message: "<error message>" }
     */
    app.post('/register', (req, res, next) => {
        let newUser = {
            "username": req.body.username,
            "password": req.body.password,
            "email": req.body.email,
            "name": req.body.name,
            "gamesplayed": 0,
            "wins": 0,
            "losses": 0,
            "admin":false,
        };

        let query = {
            $or: [
                { "username": req.body.username },
                { "email": req.body.email }
            ]
        };

        db.findOne(query, function (err, user) {
            if (err) {
                next(err);
            } else if (user) {
                res.json(jsonMessageBuilder(req.body.username, false, "username or email is already in use"));
            } else {
                // create a new user and insert to database
                db.insertOne(newUser, (err, doc) => {
                    if (err) {
                        res.json(jsonMessageBuilder(req.body.username, false, "unable to add user, please try again."));
                    } else {
                        req.login(doc.ops[0], function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send({ success: "success" });
                            }
                        });
                    }
                });
            }
        });
    });

    function jsonMessageBuilder(username, success, message) {
        return {
            "username": username,
            "success": success,
            "message": message
        }
    }



};


