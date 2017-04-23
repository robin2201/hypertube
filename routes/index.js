const express = require('express');
const app = express.Router();
const { index,
        register,
        login,
        logout,
        forget,
        resetPass} = require('../controllers/indexController')





/* GET Index page. */
app.get('/', index)
app.get('/register', register)
app.get('/login', login)
app.get('/logout', logout)
app.get('/forget', forget)
app.get('/resetPassword/:id/:token', resetPass)


module.exports = app;
