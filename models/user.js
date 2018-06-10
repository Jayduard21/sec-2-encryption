let mongoose = require('mongoose');
let bcrypt =  require('bcrypt-nodejs');
let autoIncrement = require('mongoose-auto-increment');

let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    secret_message: { type: String, required: true },
    password: { type: String, required: true }
});

// generate hash for password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// validate password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', userSchema);

