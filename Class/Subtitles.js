/**
 * Created by rberthie on 5/1/17.
 */

const OpenSubtitles = require('opensubtitles-api')
const OS = new OpenSubtitles('kw221292')
const movieSchema = require('../Scrapper/models/MovieSchema')
const request = require('request')
const zLib = require('zlib')

class Subtitles {

        constructor(postReq){
            this.imdb = postReq.imdb
            this.lang = postReq.lang
        }

        async UnzipAndUpdateMovie(zip){
            try{
                const SubUnzip = zLib.unzip(zip)

            } catch (e) { return e}
        }

        async DownloadSubtitles(sub,retry = true){
            try{
                request({
                    url:sub.url,
                    encoding: null
                }, (err, res, data) => {
                    if(err && retry){
                        return this.DownloadSubtitles(sub, false)
                    } else if(err) {
                        return {error:`Error while downloading sub`}
                    } else if(!data || res.statusCode >= 400) {
                        return {error:`Error with url ${sub.url}`}
                    } else {
                        return this.UnzipAndUpdateMovie(data)
                        console.log(data)
                    }
                })
            }catch (e) { return e }
        }


        async FIndSubtitles(){

            try{
                console.log(this.lang)
                console.log(this.imdb)
                const sub = await OS.search({
                    imdbid: this.imdb,
                    sublanguageid: this.lang,
                    gzip: true
                })
                if(sub[this.lang]){
                    this.DownloadSubtitles(sub[this.lang], false)
                    console.log(sub)
                    return sub
                }else{

                }
            }catch(e){ return e }
        }

}

module.exports = Subtitles
