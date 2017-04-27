const asyncq = require('async-q')
const Movie = require('../models/MovieSchema')

const {trakt} = require('../../config/constants')


class Track {
    constructor(imdb_id){
        this.imdbId = imdb_id
    }

    async getTraktInfo() {
        try {
            const traktMovie = await trakt.movies.summary({
                id: this.imdbId,
                extended: "full"
            })
            const traktWatchers = await trakt.movies.watching({id: this.imdbId})

            let watching = 0
            if (traktWatchers !== null) watching = traktWatchers.length


            if (traktMovie && traktMovie.ids["imdb"] && traktMovie.ids["tmdb"]) {
                return {
                    _id: traktMovie.ids["imdb"],
                    imdb_id: traktMovie.ids["imdb"],
                    title: traktMovie.title,
                    year: traktMovie.year,
                    //slug: traktMovie.ids["slug"],
                    synopsis: traktMovie.overview,
                    //runtime: traktMovie.runtime,
                    rating: {
                        hated: 100,
                        loved: 100,
                        votes: traktMovie.votes,
                        watching: watching,
                        percentage: Math.round(traktMovie.rating * 10)
                    },
                    country: traktMovie.language,
                    last_updated: Number(new Date()),
                    //images: 'test',//await this._getImages(traktMovie.ids["tmdb"], traktMovie.ids["imdb"]),
                    genres: traktMovie.genres !== null ? traktMovie.genres : ["unknown"],
                    released: new Date(traktMovie.released).getTime() / 1000.0,
                    trailer: traktMovie.trailer || null,
                    //certification: traktMovie.certification,
                    torrents: {}
                };
            }
        } catch (err) {
            return console.log(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
        }
    }

    addTorrents(movie, torrents) {
        return asyncq.each(Object.keys(torrents), torrent => movie.torrents[torrent] = torrents[torrent])
            .then(() => this._updateMovie(movie))
            .catch(e => console.log(e))
    }

    async _updateMovie(movie) {
        try {
            const found = await Movie.findOne({
                _id: movie._id
            }).exec()
            if (found) {
                console.log(`${movie._id}: '${found.title}' is an existing movie.`)

                if (found.torrents) {
                    Object.keys(found.torrents).forEach(language => {
                        movie = this._updateTorrent(movie, found, language, "720p")
                        movie = this._updateTorrent(movie, found, language, "1080p")
                    })
                }

                return await Movie.findOneAndUpdate({
                    _id: movie._id
                }, movie).exec()
            } else {
                return await new Movie(movie).save()
            }
        } catch (err) {
            return console.log(err);
        }
    }


    _updateTorrent(movie, found, language, quality) {
        let update = false;

        if (found.torrents[language] && movie.torrents[language]) {
            if (found.torrents[language][quality] && movie.torrents[language][quality]) {
                if (found.torrents[language][quality].seed > movie.torrents[language][quality].seed) {
                    update = true;
                } else if (movie.torrents[language][quality].seed > found.torrents[language][quality].seed) {
                    update = false;
                } else if (found.torrents[language][quality].url === movie.torrents[language][quality].url) {
                    update = true;
                }
            } else if (found.torrents[language][quality] && !movie.torrents[language][quality]) {
                update = true;
            }
        } else if (found.torrents[language] && !movie.torrents[language]) {
            if (found.torrents[language][quality]) {
                movie.torrents[language] = {};
                update = true;
            }
        }

        if (update) movie.torrents[language][quality] = found.torrents[language][quality];
        return movie;
    }
}

module.exports = Track