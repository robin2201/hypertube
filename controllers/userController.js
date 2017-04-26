/**
 *
 *  All this modules are using in the route users
 *  All function to create and modify your account
 *
 **/

/** Mongoose User Model **/
const User = require('../schema/userSchema')

/** Used to generate token **/
const crypto = require('crypto')
const base64 = require('base64url')
/** End tools token generation **/

/** Hash Algorithm fror passwords **/
const argon2 = require('argon2')

/** Stmp protocol using nodemailer and Mailtrap.io **/
const sendEmail = require('../tools/emailFunctions').sendEmail

/** Multer Objet create enctype/data and add .file to req **/
const Upload = require('../tools/uploadMulter')

/** HTTP simple request **/
const axios = require('axios')

const request = require('request')

const UserClass = require('../schema/userClass')

module.exports = {

    register: (req, res, next) => {
        //
        // Upload(req, res, e => {
        //     if(e) next(e)                //TODO Add File Upload or Multer to upload pic....
        //     else next()
        // })
        let UserPost = new UserClass(req.body)
        UserPost.FindUserOrCreate()
            .then(userSaved => {
                return res.render('index', userSaved)
            })
            .catch(e => next(e))
    },

    login: (req, res, next) => {
        let UserLogin = new UserClass(req.body)
        UserLogin.LogInOrRedirect()
            .then(UserLog => {
                if (UserLog.status === `ok`)
                    req.session.user = UserLog.user
                return res.render(`index`, UserLog)
            })
            .catch(e => next(e))
    },


    editInfo: (req, res, next) => {
        let UserEdit = new UserClass(req.body)
        UserEdit.EditMyInfo(req.session.user._id)
            .then(UserUpdate => {
                console.log(UserUpdate.user)
                if (UserUpdate.type === `ok`)
                    req.session.user = UserUpdate.user
                return res.render('index', {
                    message: UserUpdate.message,
                    type: 'entryPoint',
                    user: req.session.user
                })

            })
            .catch(e => next(e))
    },


    activationAccount: (req, res, next) => {
        let UserTrue = new UserClass(req.params)
        UserTrue.SetAccountToTrue()
            .then(UserAct => {
                if (UserAct.type === `ok`)
                    req.session.user = UserAct.user
                return res.render('index', {
                    user: req.session.user,
                    message: UserAct.message,
                    title: `Hypertube`,
                    type: `entryPoint`
                })
            })

            .catch(e => next(e))

    },

    sendResetInstruction: (req, res, next) => {         //TODO Error when invaid input... Ok when empty
        let UserReset = new UserClass(req.body)
        UserReset.SendReset()
            .then(ifSent => {
                return res.render('index', ifSent)
            })
            .catch(e => next(e))
    },

    newPassword: (req, res, next) => {
        let UserPass = new UserClass(req.body)
        UserPass.newPassword()
            .then(newPass => {
                res.render('index', newPass)
            })
            .catch(e => next(e))
    },

    registerWith42: (req, res, next) => {
        let User42 = new UserClass()
        try {
            User42.Oauth42(req)
                .then(ToValid => {
                    return res.render('index', ToValid)
                })
        } catch (e) {
            next(e)
        }
    }
}

/** Before oauth **/
//    console.log(req.query) // All returned by the a(href) log with 42
//    axios.post('https://api.intra.42.fr/oauth/token', {
//        grant_type: 'authorization_code',
//        client_id: 'bfa18ca1d008f4f16d51aa04f4dd4bf84924230c45c0f3987c94094c0f1eaaf1',
//        client_secret: '121cdf8ae98045e53e40e41f5f6688ed4808ac262e3ec52e04f693d7a293ebda',
//        code: req.query.code,
//        redirect_uri: 'http://localhost:3000/users/oauth/42'
//    }).then(resApi42 => {
//        console.log(resApi42)
//        let tokenType = resApi42.data.token_type
//        let accessToken = resApi42.data.access_token
//        axios.get('https://api.intra.42.fr/v2/me', {
//            headers: {'Authorization': tokenType + ' ' + accessToken}
//        }).then(userFromApi => {
//            console.log(userFromApi)
//            User.findOne({mail: userFromApi.data.email}).then(user => {
//                if (user) {
//                    return res.render('index', {
//                        title: 'Hypertube',
//                        message: "This email is already used sorry",
//                        type: 'entryPoint'
//                    })
//                } else {
//                    let token = base64(crypto.randomBytes(42))
//                    let newUser = new User({
//                        username: userFromApi.data.login,
//                        password: 'test',
//                        tokenRegisterEmail: token,
//                        validationWithEmail: false,
//                        mail: userFromApi.data.email,
//                        firstname: userFromApi.data.first_name,
//                        lastname: userFromApi.data.last_name,
//                        picture: userFromApi.data.image_url,
//                    })
//                    newUser.save().then(userSaved => {
//                        console.log(userSaved)
//                        req.session.user = userSaved
//                        sendEmail('newUser', userSaved._id, userSaved.tokenRegisterEmail, userSaved.mail)
//                        return res.render('index', {
//                            title: 'Hypertube',
//                            message: "sucess, now valid your email",
//                            type: 'entryPoint'
//                        })
//                    }).catch(e => {
//                        if (e) next(e)
//                    })
//                }
//            }).catch(e => {
//                if (e) next(e)
//            })
//        })
//    })
// }
//}


/** Register before**/

//     User.findOne({
//             $or: [
//                 {username: username},
//                 {email: email}
//             ]
//         },
//         (err, user) => {
//             if (err) next(err)
//             else if (user) {
//                 return res.render('index', {
//                     title:'Hypertube',
//                     message: "Sorry user already exist"
//                 })
//             } else {
//                 argon2.generateSalt(32).then(salt => {
//                     argon2.hash(password, salt, optionsArgon2).then(passHashedWithArgon => {
//                         let token = base64(crypto.randomBytes(42))
//                         let newUser = new User({
//                             username: protectEntry(username),
//                             password: passHashedWithArgon,
//                             tokenRegisterEmail: token,
//                             validationWithEmail: false,
//                             mail: email,
//                             firstname: protectEntry(firstname),
//                             lastname: protectEntry(lastname),
//                             picture: '',
//                         })
//                         newUser.save().then(userSaved => {
//                             req.session.user = userSaved
//                             sendEmail('newUser', userSaved._id, userSaved.tokenRegisterEmail, userSaved.mail)
//                             return res.render('index', {
//                                 title:'Hypertube',
//                                 message: "sucess, now valid your email",
//                                 type: 'entryPoint'
//                             })
//                         }).catch(e => {
//                             console.log('Error during saving User')
//                             next(e)
//                         })
//                     }).catch(e => {
//                         next(e)
//                     })
//                 }).catch(e => {
//                     next(e)
//                 })
//             }
//         })
// } else
//     return res.render('index', {
//     title:'Hypertube',
//     message: "Invalid Input type",
//     type: "register"
// })


/** Log before**/

// let {username, password} = req.body
// if (regexUsername(username) && regexPassword(password)) {
//     User.findOne({username: username}).then(user => {
//         if (user && user.validationWithEmail === true) {
//             argon2.verify(user.password, password).then(match => {
//                 if (match) {
//                     req.session.user = user
//                     res.render('index', {
//                         type: "entryPoint",
//                         user: user
//                     })
//                 } else {
//                     res.render('index', {
//                         type: 'login',
//                         message: "Error this password not match"
//                     })
//                 }
//             }).catch(e => {
//                 next(e)
//             })
//         } else if (user) {
//             res.render('index', {
//                 type: 'entryPoint',
//                 message: "Check Yours mail,, you need to validate your account before"
//             })
//         }
//         else {
//             res.render('index', {
//                 type: 'login',
//                 message: "User not found"
//             })
//         }
//     }).catch(e => {
//         next(e)
//     })
// }


/** Old Account activation**/

// console.log(req.params)
// let {id, token} = req.params
// if (id !== undefined && id !== '' && token !== undefined && token !== '') {
//     id = id.substr(1)
//     token = token.substr(1)
//     User.findOne({
//         $and: [
//             {_id: id},
//             {tokenRegisterEmail: token},
//             {validationWithEmail: false}
//         ]
//     }).then(user => {
//         if (user) {
//             User.update({
//                     _id: id
//                 },
//                 {
//                     $set: {
//                         validationWithEmail: true
//                     }
//                 },
//                 projectionWithNewDocument
//             ).then(updateUser => {
//                 req.session.user = updateUser
//                 return res.render('index', {
//                     message: "Hey your account is now valid",
//                     type: 'entryPoint',
//                     user: req.session.user
//                 })
//             }).catch(e => {
//                 if (e) next(e)
//             })
//         } else {
//             return res.render('index', {
//                 message: "An error occured, please retry or if the problem persist contact us",
//                 type: 'entryPoint'
//             })
//         }
//     }).catch(e => {
//         if (e) next(e)
//     })
// } else {
//     return res.render('index', {
//         message: "An error occured, please retry or if the problem persist contact us",
//         type: 'entryPoint'
//     })
// }

/** Old sent**/

//let email = req.body.email
// if (regexEmail(email)) {
//     User.findOne({mail: email}).then(user => {
//         if (user) {
//             res.render('index', {
//                 title: 'Hypertube',
//                 message: "Instruction for reset password are send, check your mails"
//             })
//             sendEmail('resetPass', user._id, user.tokenRegisterEmail, email)
//         } else {
//             return res.render('index', {
//                 title: 'Hypertube',
//                 message: "Sorry this email is not found",
//                 type: 'entryPoint'
//             })
//         }
//     }).catch(e => {
//         next(e)
//     })
// } else {
//     res.render('index', {
//         title: 'Hypertube',
//         message: "Invalid Input mail please retry",
//         type: "entryPoint"
//     })
// }
/** Before pass **/
// let {password, confirmPassword, id, token} = req.body
// token = String(token)
// if (password === confirmPassword && regexPassword(password)) {
//     User.findOne({
//         $and: [
//             {_id: id},
//             {tokenRegisterEmail: token}
//         ]
//     }).then(user => {
//         if (user) {
//             argon2.generateSalt(32).then(salt => {
//                 argon2.hash(password, salt, optionsArgon2).then(passHashedWithArgon => {
//                     User.update({
//                             _id: id
//                         },
//                         {
//                             $set: {
//                                 password: passHashedWithArgon
//                             }
//                         }).then(() => {
//                         return res.render('index', {
//                             title: 'Hypertube',
//                             message: "Your password is modified with sucess, Log You now",
//                             type: 'entryPoint'
//                         })
//                     }).catch(e => {
//                         if (e) next(e)
//                     })
//                 }).catch(e => {
//                     if (e) next(e)
//                 })
//             }).catch(e => {
//                 if (e) next(e)
//             })
//         } else {
//             return res.render('index', {
//                 title: 'Hypertube',
//                 message: 'An error ocured please retry',
//                 type: 'entryPoint'
//             })
//         }
//     }).catch(e => {
//         if (e) next(e)
//     })
// } else {
//     return res.render('index', {
//         title: 'Hypertube',
//         message: "Error invalid input or pass are not same",
//         type: 'entryPoint'
//     })
// }