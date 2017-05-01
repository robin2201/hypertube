const express = require('express')
const app = express.Router()

const { index,
        register,
        login,
        logout,
        forget,
        resetPass,
        home } = require('../Controllers/indexController')

// const { ScrapMovie,
//         GalleryMovie,
//         SingleMovie,
//         DownloadAndStartStream,
//         FindSubtitles} = require('../Controllers/MovieController')



/* GET Index page. */
app.get('/', index)
app.get('/register', register)
app.get('/login', login)
app.get('/logout', logout)
app.get('/forget', forget)
app.get('/resetPassword/:id/:token', resetPass)
app.get('/users/edit', home)

/** Movies Routes in test ... **/
// app.get('/torrent/update', ScrapMovie)
// app.get('/gallery/movies/:page', GalleryMovie)
// app.post('/movie/subtitle/get', FindSubtitles)
// app.get('/gallery/single/:idMovie', SingleMovie)
// app.post('/movie/download', DownloadAndStartStream)
module.exports = app;
