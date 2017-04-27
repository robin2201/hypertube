const Scrap = require('../Scrapper/Scrapper')
const MovieClass = require('../Scrapper/tools/movieClass')

module.exports = {

    ScrapMovie: (req, res, next) => {
        try {
            let scrap = new Scrap()
            scrap.scrape()
                .then(() => {
                    return console.log('Scrapping Done')
                })
        } catch (e) {
            next(e)
        }

    },

    //TODO add pagination in req.params with scip and limit keyWords in mongoose find method
    GalleryMovie: (req, res, next) => {
        try {
            const AllMovie = new MovieClass()
            AllMovie.ReturnAllMovies()
                .then(List => {
                    console.log(List)
                    return res.render('movie', {
                        movies: List,
                        type: 'Gallery'
                    })
                })

        } catch (e) {
            next(e)
        }
    },

    SingleMovie: (req, res, next) => {
        try {
            const OneMovie = new MovieClass(req.params.idMovie)
            OneMovie.ReturnOneMovie()
                .then((ifExist) => {
                    return res.render('movie', {
                        movie: ifExist,
                        type: 'One'
                    })
                })

        } catch (e) {
            next(e)
        }
    },

    DownloadAndStartStream: (req, res, next) => {

    }

}