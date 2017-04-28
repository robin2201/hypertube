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
        SingleMovie,
        DownloadAndStartStream} = require('../controllers/MovieController')



/* GET Index page. */
app.get('/', index)
app.get('/register', register)
app.get('/login', login)
app.get('/logout', logout)
app.get('/forget', forget)
app.get('/resetPassword/:id/:token', resetPass)
app.get('/users/edit', home)

/** Movies routes in test ... **/
app.get('/torrent/update', ScrapMovie)
app.get('/gallery/movies/:page', GalleryMovie)
app.get('/gallery/single/:idMovie', SingleMovie)
app.post('/movie/download', DownloadAndStartStream)
module.exports = app;
