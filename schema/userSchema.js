const mongoose = require('../config/mongoose')

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
    },
    tokenRegisterEmail: String,
    password:{
        type: String,
        required: true
    },
    validationWithEmail: Boolean,
    mail: {
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true,
    },
    picture : {
        type: String,
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
