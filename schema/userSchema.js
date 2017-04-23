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
    picture : String,
})

let User = mongoose.model('User', userSchema)

module.exports = User

//TODO Modify this schema to add specification