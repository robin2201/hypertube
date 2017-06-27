/**
 * Here All the constants we can need for this projet
 *
**/

/** Const to params request to Scrap Api **/
const maxWebRequest = 2
const webRequestTimeout = 2


/** MONGOOSE const **/
const dbHosts = ["localhost"]

const dbName = "hypertube"

const Promise = global.Promise
/** Prjection For UserSchema Mongoose**/
const projectionWithNewDocument = {
    projection: {
        password: 0,
        tokenRegisterEmail: 0
    },
    new: true
}
/** End Mongoose const**/

const extraTorrentMovie =     {
    name: "ExtraTorrent",
    query: {with_words: "x264 yify brrip"}
}


const allUsersProjection = {
    projection: {
        password: 0,
        tokenRegisterEmail: 0,
        viewved: 0,
        validationWithEmail: 0
    }
}

// {name: "ETRG BRRip", query: {with_words: "etrg x264 brrip"}},
    // {name: "ETRG BluRay", query: {with_words: "etrg x264 bluray"}},
    // {name: "YIFY", query: {with_words: "ettv"}}


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
    projectionWithNewDocument,
    AxiosOAuth42,
    extraTorrentMovie,
    allUsersProjection
}

