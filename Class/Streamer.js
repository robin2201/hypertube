const torrentStream = require('torrent-stream')
const fs = require('fs')



class Streamer {

    constructor(magnet){
        this.magnet = magnet
    }

    /**
     *
     * @returns {string}
     */
    ifDirDoesNotExist(){
        const pathToDl = `./tmp`
        try{
            fs.accessSync(pathToDl)
        } catch (e) {
            fs.mkdirSync(pathToDl)
        }
        return pathToDl
    }

    async ExtractMagnetAndTrackers(){
        try{
            const pathToDl = this.ifDirDoesNotExist()
            const MagnetAndTrackers = this.magnet.split(`&`)
            const Magnet = MagnetAndTrackers.shift()
            const opts = {
                connections: 100,
                uploads: 10,
                tmp: pathToDl,
                path: `${pathToDl}/test`,
                verify: true,
                dht: true,
                tracker: true,
                trackers: MagnetAndTrackers,
            }
            return await {magnet:Magnet, opts:opts}
        } catch (e) {
            return {message:`An error occured with the magnet ${this.magnet}`}
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
        } catch (e) { return e}

    }

}

module.exports = Streamer


