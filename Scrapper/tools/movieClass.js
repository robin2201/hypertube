/**
 * Created by robin on 4/26/17.
 */
const MovieSchema = require('../models/MovieSchema')


class Movie {

    constructor(movie = null, idMovie = null){
        if(movie)
            this.movie = movie
        if(idMovie)
            this.idMovie = idMovie

    }

    async AddMovieOrReturnIfExist() {
        try {
            const ifExist = await MovieSchema.findOne({_id: this.movie._id}).exec()
            if (ifExist) {
                return this.movie
            } else {
                return await new MovieSchema(this.movie).save()
            }
        } catch (err) {
            return console.log(`error ${err} ocurred with this movie ${this.movie.id && this.movie.title}`)
        }
    }
}

module.exports = Movie