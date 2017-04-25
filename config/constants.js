/**
 * Here All the constants we can need for this projet
 *
**/
const Trakt = require('trakt.tv')



const dbHosts = ["localhost"]

const dbName = "hypertube"

const Promise = global.Promise

const maxWebRequest = 2

const webRequestTimeout = 2


const trakt = new Trakt({
    client_id: "70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907"
})

const projectionWithNewDocument = {
    projection: {
        password: 0,
        mail: 0,
        tokenRegisterEmail: 0
    },
    new: true
}

// const userReg = username => /^([a-zA-Z\-0-9_]{4,20})$/

// const namReg =

module.exports =  {
    dbHosts,
    dbName,
    Promise,
    maxWebRequest,
    webRequestTimeout,
    trakt,
    projectionWithNewDocument
}