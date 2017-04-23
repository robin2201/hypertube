/**
 * Created by robin on 4/21/17.
 */
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/hypertube')

let db = mongoose.connection

db.on('error', err => {
    console.log('DB Connection error : ', err)
}).once('open', () => {
    console.log('DB Connection successed')
})

module.exports = mongoose
