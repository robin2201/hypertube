/**
 * Here All the constants we can need for this projet
 *
**/
const Trakt = require('trakt.tv')



/** Const to params request to Scrap Api **/
const maxWebRequest = 2
const webRequestTimeout = 2


/** Trakt.Tv Api find all information about Movie thks to imdb**/
// const trakt = new Trakt({
//     client_id: "70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907"
// })


/** MONGOOSE const **/
const dbHosts = ["localhost"]

const dbName = "hypertube"

const Promise = global.Promise
/** Prjection For UserSchema Mongoose**/
const projectionWithNewDocument = {
    projection: {
        password: 0,
        mail: 0,
        tokenRegisterEmail: 0
    },
    new: true
}
/** End Mongoose const**/

/** Api Key for 42 **/
const AxiosOAuth42 = {
    grant_type: 'authorization_code',
    client_id: 'bfa18ca1d008f4f16d51aa04f4dd4bf84924230c45c0f3987c94094c0f1eaaf1',
    client_secret: '121cdf8ae98045e53e40e41f5f6688ed4808ac262e3ec52e04f693d7a293ebda',
    code: ``,
    redirect_uri: 'http://localhost:3000/users/oauth/42'
}

module.exports =  {
    dbHosts,
    dbName,
    Promise,
    maxWebRequest,
    webRequestTimeout,
    //trakt,
    projectionWithNewDocument,
    AxiosOAuth42
}