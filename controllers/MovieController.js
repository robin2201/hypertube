const Scrap = require('../Scrapper/Scrapper')
const MovieClass = require('../Scrapper/tools/movieClass')

const torrentStream = require('torrent-stream')

module.exports = {
    /**
     *
     * @param req
     * @param res
     * @param next
     * @constructor
     */
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
    /**
     *
     * @param req
     * @param res
     * @param next
     * @constructor
     */
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
    /**
     *
     * @param req
     * @param res
     * @param next
     * @constructor
     */
    SingleMovie: (req, res, next) => {
        try {
            const OneMovie = new MovieClass(req.params.idMovie)
            OneMovie.ReturnOneMovie()
                .then((ifExist) => {
                console.log(ifExist)
                    return res.render('movie', {
                        movie: ifExist,
                        type: 'One',
                    })
                })

        } catch (e) {
            next(e)
        }
    },

    DownloadAndStartStream: (req, res, next) => {
        try{
            let test = {

            }
            console.log(req.body.torrent)
            const t = req.body.torrent.split('&')
            console.log(t)
            let engine = torrentStream(t[0])

        } catch (e) { return e }


    }

}