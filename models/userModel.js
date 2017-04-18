/**
 * Created by robin on 4/18/17.
 */
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    profilePic: String,
    token: String,
    validationAccount: Boolean,
})

const User = mongoose.model("User", UserSchema)

export default User