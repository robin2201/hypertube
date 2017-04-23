/**
 * Created by robin on 4/21/17.
 */
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hypertube');

let db = mongoose.connection;

db.on('error', err => {
    console.log('DB Connection error : ', err);
});

db.once('open', () => {
    console.log('DB Connection successed');
});

module.exports = mongoose;
