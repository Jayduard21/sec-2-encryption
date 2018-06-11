let mongoose = require('mongoose');
let bcrypt =  require('bcrypt-nodejs');
let autoIncrement = require('mongoose-auto-increment');

let userSchema = mongoose.Schema({
    name: { type: String },
    message: { type: String },
    password: { type: String }
});

// generate hash for password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// validate password
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', userSchema);

