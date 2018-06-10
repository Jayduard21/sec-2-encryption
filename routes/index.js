// user routes

let User = require('../model/user');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index.ejs')
    });

    app.post('/user', function(req, res) {

    });

    app.get('/message', function(req, res) {

    });
}

