/**
 * Created by robin on 4/21/17.
 */
const User = require('../schema/userSchema')
const crypto = require('crypto')
const base64 = require('base64url')
const argon2 = require('argon2')
const sendEmail = require('../tools/emailFunctions').sendEmail
const Upload = require('../tools/uploadMulter')
const axios = require('axios')

const { protectEntry,
        regexName,
        regexUsername,
        regexPassword,
        regexEmail} = require('../tools/verifInput')

const optionsArgon2 = {
    timeCost: 4, memoryCost: 13, parallelism: 2, type: argon2.argon2d
}

const projectionWithNewDocument = {
    projection: {
        password: 0,
        mail: 0,
        tokenRegisterEmail: 0
    },
    returnOriginal: false

}

module.exports = {

    register: (req, res, next) => {
        let {firstname, lastname, username, email, password, confirmPassword, picture} = req.body
        if (protectEntry(regexName(firstname)) && protectEntry(regexName(lastname)) && protectEntry(regexUsername(username)) && protectEntry(regexPassword(password)) && protectEntry(regexEmail(email)) && password === confirmPassword) {

            User.findOne({
                    $or: [
                        {username: username},
                        {email: email}
                    ]
                },
                (err, user) => {
                    if (err) next(err)
                    else if (user) {
                        return res.render('index', {
                            title:'Hypertube',
                            message: "Sorry user already exist"})
                    } else {
                        argon2.generateSalt(42).then(salt => {
                            argon2.hash(password, salt, optionsArgon2).then(passHashedWithArgon => {
                                let token = base64(crypto.randomBytes(42))
                                let newUser = new User({
                                    username: protectEntry(username),
                                    password: passHashedWithArgon,
                                    tokenRegisterEmail: token,
                                    validationWithEmail: false,
                                    mail: protectEntry(email),
                                    firstname: protectEntry(firstname),
                                    lastname: protectEntry(lastname),
                                    avatar: picture ? picture : '',
                                })
                                newUser.save().then(userSaved => {
                                    req.session.user = userSaved
                                    sendEmail('newUser', userSaved._id, userSaved.tokenRegisterEmail, userSaved.mail)
                                    return res.render('index', {
                                        title:'Hypertube',
                                        message: "sucess, now valid your email",
                                        type: 'entryPoint'
                                    })
                                }).catch(e => {
                                    next(e)
                                })
                            }).catch(e => {
                                next(e)
                            })
                        }).catch(e => {
                            next(e)
                        })
                    }
                })
        } else return res.render('index', {
            title:'Hypertube',
            message: "Invalid Input type",
            type: "register"
        })

    },

    login: (req, res, next) => {
        let {username, password} = req.body
        if (protectEntry(regexUsername(username)) && protectEntry(regexPassword(password))) {
            User.findOne({username: username}).then(user => {
                if (user && user.validationWithEmail === true) {
                    argon2.verify(user.password, password).then(match => {
                        if (match) {
                            req.session.user = user
                            res.render('index', {
                                type: "entryPoint",
                                user: user
                            })
                        } else {
                            res.render('index', {
                                type: 'login',
                                message: "Error this password not match"
                            })
                        }
                    }).catch(e => {
                        next(e, {message: "internal Error, please retry"})
                    })
                } else if (user) {
                    res.render('index', {
                        type: 'entryPoint',
                        message: "Check Yours mail,, you need to validate your account before"
                    })
                }
                else {
                    res.render('index', {
                        type: 'login',
                        message: "User not found"
                    })
                }
            }).catch(e => {
                next(e)
            })
        }
    },

    editInfo: (req, res, next) => {

    },

    activationAccount: (req, res, next) => {
        console.log(req.params)
        let {id, token} = req.params
        if (id !== undefined && id !== '' && token !== undefined && token !== '') {
            id = id.substr(1)
            token = token.substr(1)
            User.findOne({
                $and: [
                    {_id: id},
                    {tokenRegisterEmail: token},
                    {validationWithEmail: false}
                ]
            }).then(user => {
                if (user) {
                    User.update({
                            _id: id
                        },
                        {
                            $set: {
                                validationWithEmail: true
                            }
                        },
                        projectionWithNewDocument
                    ).then(updateUser => {
                        req.session.user = updateUser
                        return res.render('index', {
                            message: "Hey your account is now valid",
                            type: 'entryPoint',
                            user: req.session.user
                        })
                    }).catch(e => {
                        if (e) next(e)
                    })
                } else {
                    return res.render('index', {
                        message: "An error occured, please retry or if the problem persist contact us",
                        type: 'entryPoint'
                    })
                }
            }).catch(e => {
                if (e) next(e)
            })
        } else {
            return res.render('index', {
                message: "An error occured, please retry or if the problem persist contact us",
                type: 'entryPoint'
            })
        }
    },

    sendResetInstruction: (req, res, next) => {
        let email = req.body.email
        if (regexEmail(email)) {
            User.findOne({mail: email}).then(user => {
                if (user) {
                    sendEmail('resetPass', user._id, user.tokenRegisterEmail, email)
                    return res.render('index', {
                        title:'Hypertube',
                        message: "Instruction for reset password are send, check your mails"
                    })
                } else {
                    return res.render('index', {
                        title:'Hypertube',
                        message: "Sorry this email is not found",
                        type: 'entryPoint'
                    })
                }
            }).catch(e => {
                next(e)
            })
        } else {
            res.render('index', {
                title:'Hypertube',
                message: "Invalid Input mail please retry",
                type: "entryPoint"
            })
        }

    },

    newPassword: (req, res, next) => {
        let {password, confirmPassword, id, token} = req.body
        token = String(token)
        if (password === confirmPassword && regexPassword(password)) {
            User.findOne({
                $and: [
                    {_id: id},
                    {tokenRegisterEmail: token}
                ]
            }).then(user => {
                if (user) {
                    argon2.generateSalt(42).then(salt => {
                        argon2.hash(password, salt, optionsArgon2).then(passHashedWithArgon => {
                            User.update({
                                    _id: id
                                },
                                {
                                    $set:{
                                        password:passHashedWithArgon
                                    }
                                }).then(() => {
                                    return res.render('index', {
                                        title:'Hypertube',
                                        message:"Your password is modified with sucess, Log You now",
                                        type:'entryPoint'
                                    })
                            }).catch(e => {
                                if(e) next(e)
                            })
                        }).catch(e => {
                            if(e) next(e)
                        })
                    }).catch(e => {
                        if (e) next(e)
                    })
                }else{
                    res.render('index', {
                        title:'Hypertube',
                        message:'An error ocured please retry',
                        type:'entryPoint'
                    })
                }
            }).catch(e => {
                if (e) next(e)
            })
        } else {
            res.render('index', {
                title:'Hypertube',
                message: "Error invalid input or pass are not same",
                type: 'entryPoint'
            })
        }
    },

    registerWith42: (req, res, next) => {
        console.log('Nice')
        console.log(req.query)
        if(req.query.code !== ''){
            axios.post('https://api.intra.42.fr/oauth/token', {
                grant_type : 'authorization_code',
                client_id : 'bfa18ca1d008f4f16d51aa04f4dd4bf84924230c45c0f3987c94094c0f1eaaf1',
                client_secret : '121cdf8ae98045e53e40e41f5f6688ed4808ac262e3ec52e04f693d7a293ebda',
                code : req.query.code,
                redirect_uri : 'http://localhost:3000/users/oauth/42'
            }).then(resApi42 => {
                console.log(resApi42)
                let tokenType = resApi42.data.token_type
                let accessToken = resApi42.data.access_token
                axios.get('https://api.intra.42.fr/v2/me', {
                    headers : { 'Authorization' : tokenType + ' ' + accessToken }
            }).then(userFromApi => {
                console.log(userFromApi)
                User.findOne({mail: userFromApi.data.email}).then(user => {
                    if(user){
                        return res.render('index', {
                            message:"This email is already used sorry",
                            type:'entryPoint'
                        })
                    }else{
                        let token = base64(crypto.randomBytes(42))
                        let newUser = new User({
                            username: userFromApi.data.login,
                            password: passHashedWithArgon,
                            tokenRegisterEmail: token,
                            validationWithEmail: false,
                            mail: userFromApi.data.email,
                            firstname: userFromApi.data.first_name,
                            lastname: userFromApi.data.last_name,
                            avatar: userFromApi.data.image_url,
                        })
                        newUser.save().then(userSaved => {
                            console.log(userSaved)
                            req.session.user = userSaved
                            sendEmail('newUser', userSaved._id, userSaved.tokenRegisterEmail, userSaved.mail)
                            return res.render('index', {
                                title:'Hypertube',
                                message: "sucess, now valid your email",
                                type: 'entryPoint'
                            })
                        }).catch(e => {
                            if(e) next(e)
                        })
                    }
                }).catch(e => {
                    if (e) next(e)
                })
                })
            })

        }

    }
}