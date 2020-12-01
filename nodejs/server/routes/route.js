/**
 * routes.js
 * 
 * Manage routing
 * 
 * TODO: Hash and encrypt user password before inserting
 */

module.exports = function (app, db) {

    app.route('/').get((req, res) =>{
        res.redirect('/');
    });
};


