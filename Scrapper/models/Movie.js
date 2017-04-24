/**
 * Created by rberthie on 4/24/17.
 */
const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
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
    slug: String,
    synopsis: String,
    runtime: String,
    rating: {
        percentage: Number,
        watching: Number,
        votes: Number,
        loved: Number,
        hated: Number
    },
    country: String,
    last_updated: Number,
    images: {
        banner: String,
        fanart: String,
        poster: String
    },
    genres: [],
    released: Number,
    trailer: {
        type: String,
        default: null
    },
    certification: String,
    torrents: {}
})

const Movie = MovieSchema.model('Movie', MovieSchema)

module.exports = Movie