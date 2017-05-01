/**
 * Created by rberthie on 5/1/17.
 */

const OpenSubtitles = require('opensubtitles-api')
const OS = new OpenSubtitles('OSTestUserAgent')
const movieSchema = require('../Scrapper/models/MovieSchema')
const request = require('request')

class Subtitles {

        constructor(imdb, lang){
            this.imdb = imdb
            this.lang = lang
        }



        async DownloadSubtitles(){

        }


        async FIndSubtitles(){
            try{
                const sub = await OS.search({
                    imdbid: this.imdb,
                    sublanguageid: this.lang,
                    gzip: true
                })
                if(sub){
                    console.log(sub)
                }
            }catch(e){ return e }
        }

}
