let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let morgan = require('morgan');
let dotEnv = require('dotenv').config();

var cookieParser = require('cookie-parser');
var bodyParser =  require('body-parser');
var session =  require('express-session');

mongoose.connect(process.env.DB_URL);
mongoose.Promise = require('q').Promise;
autoIncrement.initialize(mongoose.connection);

require('./models/user');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: false}));

app.use(session({ secret: process.env.SESSION_SECRTET_KEY, resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');

require('./routes/index.js')(app);

app.use(express.static('public'));

app.get('*', function(req, res) {
    return res.status(404).render('404');
});

app.listen(port);
console.log('The magic happens on port: ' + port);

module.exports = app;
