const mongoose = require('../config/mongoose')

let userSchema = mongoose.Schema({
    username : String,
    // password : {
    //     salt: String,
    //     hashPassword: String,
    // },
    tokenRegisterEmail: String,
    password: String,
    validationWithEmail: Boolean,
    mail : String,
    firstname : String,
    lastname : String,
    avatar : String,
});

let User = mongoose.model('User', userSchema)

module.exports = User;
