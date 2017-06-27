

const facebookAuth = {
    'clientID'      : '403301276718511',
    'clientSecret'  : '8048a8c4235b0d818c3f729fb56594e8',
    'callbackURL'   : 'http://localhost:3000/users/facebook/cb'
}

const twitterAuth = {
    'consumerKey'       : 'your-consumer-key-here',
    'consumerSecret'    : 'your-client-secret-here',
    'callbackURL'       : 'http://localhost:3000/users/twitter/cb'
}

const googleAuth = {
    key:`409337954243-qlp9l41la5a1m7eqd31n8kqn8ntqcjlm.apps.googleusercontent.com`

}

const Auth42 = {
    grant_type: 'authorization_code',
    client_id: 'bfa18ca1d008f4f16d51aa04f4dd4bf84924230c45c0f3987c94094c0f1eaaf1',
    client_secret: '121cdf8ae98045e53e40e41f5f6688ed4808ac262e3ec52e04f693d7a293ebda',
    code: ``,
    redirect_uri: 'http://localhost:3000/users/oauth/42'
}

module.exports = {
    facebookAuth,
    twitterAuth,
    Auth42
}