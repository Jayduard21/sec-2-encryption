// user routes
let crypto = require('crypto');
let User = require('../models/user');
const IV = 16;
let key = process.env.SECRET_KEY || 'thismustbe32characterslong32long';

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('home.ejs', { message: null });
    });

    app.post('/', createUser);

    app.post('/message', getMessage);
}


function createUser(req, res) {

    User.findOne({'name': req.body.name }, function(err, existingUser) {
        
        if(err) {
            console.log(err);
            return res.status(505).render('home', { message: err });
        }

        if (existingUser) {
            return res.render('home', { 'message': 'That name is already taken' });
        }

        let newUser = new User();

        let iv = crypto.randomBytes(IV);
        let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);
        let cryptedMessage = cipher.update(req.body.secretMessage.toString());
        cryptedMessage = Buffer.concat([cryptedMessage, cipher.final()]);

        let message = iv.toString('hex') + ':' + cryptedMessage.toString('hex');

        newUser.name = req.body.name;
        newUser.message = message;
        newUser.password = newUser.generateHash(req.body.password);

        newUser.save(function(err) {
            if (err)
                throw err;
            
            return res.render('home',  { message: 'saved user' });
        });
    });
}

function getMessage(req, res){
    User.findOne({ 'name': req.body.name }, function(err, user) {
        if (err) {
            console.log(err);
            return res.status('500').render('home', { message: err});
        }

        if(!user) {
            return res.render('home', { message: 'No user found.' });
        }

        if(!user.validatePassword(req.body.password)) {
            return res.render('home', { message: 'Wrong name or passwords.' });
        }

        let textParts = user.message.split(':');
        let iv = new Buffer(textParts.shift(), 'hex');
        let toDecipher = new Buffer(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);
        let decrypt = decipher.update(toDecipher);
        decrypt = Buffer.concat([decrypt, decipher.final()]);
        
        return res.render('secretmessage', { message: decrypt.toString() });
    });
}

