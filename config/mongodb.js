/**
 * Created by robin on 4/18/17.
 */
const { dbHosts, dbName} = require('./constants')
const mongoose = require('mongoose')

let options = {

}
module.exports = {
    connectMongoDB: () => {
        mongoose.connect(`mongodb://${dbHosts.join(",")}/${dbName}`, {
            db: {
                native_parser: true
            },
            replset: {
                rs_name: "pt0",
                connectWithNoPrimary: true,
                readPreference: "nearest",
                strategy: "ping",
                socketOptions: {
                    keepAlive: 1
                }
            },
            server: {
                readPreference: "nearest",
                strategy: "ping",
                socketOptions: {
                    keepAlive: 1
                }
            }
        });
    }

}

