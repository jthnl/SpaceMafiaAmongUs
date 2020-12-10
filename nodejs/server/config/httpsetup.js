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
    app.route('/register').post(
        (req, res, next) => {
            addNewUser(req, res, next);
        },
        passport.authenticate('local', { failWithError: true }),
        function (req, res, next) {
            console.log("successfully registered User");
        },
        function (err, req, res, next) {
            console.log("register: something went wrong");
            next(err);
        }
    );


    /**
     * Helper function to Add user to DB 
     * FUTURE TODO: clean up code using Mongoose
     */
    function addNewUser(req, res, next) {
        let query = {
            $or: [
                { "username": req.body.username },
                { "email": req.body.email }
            ]
        };
        let newUser = {
            "username": req.body.username,
            "password": req.body.password,
            "email": req.body.email,
            "name": req.body.name,
            "gamesplayed": 0,
            "wins":0,
            "losses":0
        }
        db.findOne(query, function (err, user) {
            if (err) {
                next(err);
            } else if (user) {
                // if user already exists, return JSON with error
                res.json(jsonMessageBuilder(req.body.username, false, "username or email is already in use"));
            } else {
                // create a new user and insert to database
                db.insertOne(newUser, (err, doc) => {
                    if (err) {
                        // if insert fails
                        console.log(console.error());
                        res.json(jsonMessageBuilder(req.body.username, false, "was not able to create new user"));
                    } else {
                        // if successfully inserted, return success message
                        console.log(doc.ops[0]);
                        res.json(jsonMessageBuilder(req.body.username, true, "successfully created new user"));
                    }
                });
            }
        }
        );
    }

    function jsonMessageBuilder(username, success, message) {
        return {
            "username": username,
            "success": success,
            "message": message
        }
    }



};


