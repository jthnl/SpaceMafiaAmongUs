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
    app.route('/').get((req, res) =>{
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
     */
    function addNewUser(req, res, next){
        db.findOne(
            { $or: [{ "username": req.body.username }, { "email": req.body.email }] },
            function(err, user){
                if (err) {
                    next(err);
                } else if (user) {
                    // if user already exists, return JSON with error
                    res.json({
                        "username": req.body.username,
                        "success": false,
                        "message": "username or email is already in use"
                    });
                } else {
                    // create a new user and insert to database
                    let newUser = {
                        "username": req.body.username,
                        "password": req.body.password,
                        "email": req.body.email,
                        "name": req.body.name,
                    };
                    db.insertOne(newUser, (err, doc) => {
                        if (err) {
                            // if insert fails
                            console.log(console.error());
                            res.json({
                                "username": req.body.username,
                                "success": false,
                                "message": "was not able to create new user"
                            });
                        } else {
                            // if successfully inserted, return success message
                            console.log(doc.ops[0]);
                            res.json({
                                "username": req.body.username,
                                "success": true,
                                "message": "successfully created new user"
                            });
                        }
                    });
                }
            }
        );
    }

};


