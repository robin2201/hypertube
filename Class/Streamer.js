const torrentStream = require('torrent-stream')
const fs = require('fs')


//TODO Add method to update movie document { download: { time: New date, path:this.path } }
class Streamer {
    /**
     *
     * @param magnet
     */
    constructor(magnet){
        this.magnet = magnet
        this.path = `./tmp`
    }

    /**
     *
      * @returns {Promise.<void>}
     */
    async ifDirDoesNotExist(){
        try{
            fs.accessSync(this.path)
        } catch (e) {
            fs.mkdirSync(this.path)
        }
    }

    /**
     *
     * @returns {Promise.<*>}
     * @constructor
     */
    async ExtractMagnetAndTrackers(){
        try{
            this.ifDirDoesNotExist()
            const Trackers = this.magnet.split(`&`)
            const Magnet = Trackers.shift()
            const opts = {
                connections: 100,
                uploads: 10,
                tmp: this.path,
                path: `${this.path}/test`,
                verify: true,
                dht: true,
                tracker: true,
                trackers: Trackers,
            }
            return await { magnet:Magnet, opts:opts }
        } catch (e) {
            return { message:`An error occured with the magnet ${this.magnet}` }
        }
    }

    async DownloadTorrent() {
        try {
            const optsTorrentStream = await this.ExtractMagnetAndTrackers()
            const engine = torrentStream(optsTorrentStream.magnet, optsTorrentStream.opts)
            engine.on('ready', () => {
                console.log(engine.files)
                engine.files.forEach(file => {
                    return file.createReadStream()
                })
            })
        } catch (e) { return e }

    }

}

module.exports = Streamer


