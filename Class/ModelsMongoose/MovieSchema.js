/**
 * Created by rberthie on 4/24/17.
 */
const mongoose = require('mongoose')

const Movie = new mongoose.Schema({
    _id: {
        type: String,
        required: true,

        index: {
            unique: true
        }
    },
    imdb_id: String,
    title: String,
    year: String,
    synopsis: String,
    rating: Number,
    picture: {
        banner: String,
        back: String,
        poster: String,
    },
    country: String,
    genres: [],
    trailer: {
        type: String,
        default: null
    },
    torrents: {}
})

const MovieSchema = mongoose.model('Movie', Movie)

module.exports = MovieSchema