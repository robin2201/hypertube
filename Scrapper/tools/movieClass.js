const MovieSchema = require('../models/MovieSchema')


class Movie {
    /**
     *
     * @param movie
     */
    constructor(movie){
            this.movie = movie

    }

    /**
     *
     * @returns {Promise.<*>}
     * @constructor
     */
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

    /**
     *
     * @returns {Promise.<*>}
     * @constructor
     */
    //TODO add req.params.page to calculate scip and limit scip = (nb elem) * page
    async ReturnAllMovies(){
        try {
            return await MovieSchema.find({}).limit(100)
        } catch (e){
            return(e)
        }
    }

    /**
     *
     * @returns {Promise.<*>}
     * @constructor
     */
    async ReturnOneMovie(){
        try{
            return await MovieSchema.findOne({_id: this.movie}).exec()
        } catch (e) { return e}
    }
}

module.exports = Movie