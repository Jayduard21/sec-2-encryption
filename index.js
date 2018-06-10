let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let passport = require('passport');
let flash = require('connect-flash');
let dotEnv = require('dotenv').config();


mongoose.connect(process.env.DB_URL);
mongoose.Promise = require('q').Promise;
autoIncrement.initialize(mongoose.connection);

app.set('view engine', 'ejs');

require('./routes/index.js')(app);

app.use(express.static('public'));

app.get('*', function(req, res) {
    return res.status(404).render('errors/404');
});

app.listen(port);
console.log('The magic happens on port: ' + port);

module.exports = app;
