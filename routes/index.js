const express = require('express')
const app = express.Router()

const { index,
        register,
        login,
        logout,
        forget,
        resetPass,
        home } = require('../controllers/indexController')

const { ScrapMovie,
        GalleryMovie,
        SingleMovie} = require('../controllers/MovieController')



/* GET Index page. */
app.get('/', index)
app.get('/register', register)
app.get('/login', login)
app.get('/logout', logout)
app.get('/forget', forget)
app.get('/resetPassword/:id/:token', resetPass)
app.get('/users/edit', home)
app.get('/tamere', ScrapMovie)
app.get('/gallery/movies/:page', GalleryMovie)
app.get('/gallery/single/:idMovie', SingleMovie)

module.exports = app;
