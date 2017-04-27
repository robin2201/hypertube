/**
 * Created by robin on 4/26/17.
 */
const MovieSchema = require('../models/MovieSchema')


class Movie {

    constructor(movie){
            this.movie = movie

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

    //TODO add req.params.page to calculate scip and limit scip = (nb elem) * page
    async ReturnAllMovies(){
        try {
            return await MovieSchema.find({}).limit(40)
        } catch (e){
            return(e)
        }
    }

    async ReturnOneMovie(){
        console.log(`This movie ====>   ${this.movie}`)
        try{
            let tam = await MovieSchema.findOne({_id: this.movie}).exec()
            console.log(tam)
            return tam
        } catch (e) { return e}
    }
}

module.exports = Movie