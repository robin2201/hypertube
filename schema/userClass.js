/**
 * Created by robin on 4/25/17.
 */
const UserSchema = require('../schema/userSchema')

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

/** All Regex for input verifications **/
const {
    protectEntry,
    regexName,
    regexUsername,
    regexPassword,
    regexEmail
} = require('../tools/verifInput')
/** End Regex **/

const optionsArgon2 = {
    timeCost: 4, memoryCost: 13, parallelism: 2, type: argon2.argon2d
}

/** Opt for Argon2 for optimisation use more memory, work on 2 threads **/
const {projectionWithNewDocument, AxiosOAuth42} = require('../config/constants')


class User {

    constructor(data) {
        this.data = data
    }

    controlInput(int) {
        if (int === 1) {
            return (regexName(this.data.firstname)
            && regexName(this.data.lastname)
            && regexEmail(this.data.email)
            && regexUsername(this.data.username)
            && regexPassword(this.data.password)
            && this.data.password === this.data.confirmPassword)
        } else if (int === 2) {
            return (regexUsername(this.data.username)
            && regexPassword(this.data.password))
        } else if (int === 3) {
            return (regexName(this.data.firstname)
            || regexName(this.data.lastname)
            || regexEmail(this.data.email)
            || regexUsername(this.data.username))
        }

    }

    async FindUserOrCreate() {
        if (this.controlInput(1) === true) {
            let user = await UserSchema.findOne({
                $or: [
                    {username: this.data.username},
                    {mail: this.data.email}
                ]
            })
            if (user) {
                return {
                    title: 'Hypertube',
                    message: `Sorry the ${this.data.username} or ${this.data.email} are already taken`,
                    type: `register`
                }
            } else {
                const passHashedWithArgon = await argon2.hash(this.data.password, await argon2.generateSalt(32), optionsArgon2)
                let token = base64(crypto.randomBytes(42))
                let newUser = new UserSchema({
                    username: protectEntry(this.data.username),
                    password: passHashedWithArgon,
                    tokenRegisterEmail: token,
                    validationWithEmail: false,
                    mail: this.data.email,
                    firstname: protectEntry(this.data.firstname),
                    lastname: protectEntry(this.data.lastname),
                    picture: '',
                })
                let UserSaved = await newUser.save()
                sendEmail(`register`, UserSaved._id, token, this.data.email)
                return {title: 'Hypertube', message: "sucess, now valid your email", type: 'entryPoint'}
            }
        } else {
            return {title: 'Hypertube', message: `Invalid Input ..`, type: `register`}
        }
    }

    async LogInOrRedirect() {
        if (this.controlInput(2)) {
            let user = await UserSchema.findOne({
                $and: [
                    {username: this.data.username},
                    {validationWithEmail: true}
                ]
            })
            if (user) {
                try {
                    if (await argon2.verify(user.password, this.data.password))
                        return {
                            user: user,
                            message: `Hello ${this.data.username} very happy to see you`,
                            type: `entryPoint`,
                            title: `Hpertube`,
                            status: `ok`
                        }
                    else
                        return {type: `login`, message: `Your Pass is not same please retry`, title: `Hpertube`}
                } catch (err) {
                    return {type: `login`, message: `An Internal Error Occured please try later`, title: `Hpertube`}
                }
            } else return {
                type: `login`,
                message: `${this.data.username} not found or account nor vaildate`,
                title: `Hpertube`
            }
        } else return {type: `login`, message: `Entry not conform`, title: `Hpertube`}
    }

    async newPassword() {
        if (this.data.password === this.data.confirmPassword && regexPassword(password)) {
            try {
                let user = await UserSchema.findOne({
                    $and: [
                        {_id: this.data.id},
                        {tokenRegisterEmail: String(this.data.token)}
                    ]
                })
                if (user) {
                    try {
                        const passHashedWithArgon = await argon2.hash(this.data.password, await argon2.generateSalt(32), optionsArgon2)
                        UserSchema.updateOne({
                                _id: this.data.id
                            },
                            {
                                $set: {password: passHashedWithArgon}
                            },
                            projectionWithNewDocument)
                            .then(() => {
                                return {
                                    title: 'Hypertube',
                                    message: "Your password is modified with sucess, Log You now",
                                    type: 'login'
                                }
                            })
                    } catch (e) {
                        return {title: 'Hypertube', message: "An error occurred when updating ...", type: 'entryPoint'}
                    }
                }
            } catch (e) {
                return {title: 'Hypertube', message: "Wrong Passport...", type: 'entryPoint'}
            }
        }
    }

    async EditMyInfo(id) {
        if (this.controlInput(3)) {
            let query = {}
            this.data.username !== '' ? query.username = protectEntry(this.data.username) : undefined
            this.data.firstname !== '' ? query.firstname = protectEntry(this.data.firstname) : undefined
            this.data.lastname !== '' ? query.lastname = protectEntry(this.data.lastname) : undefined
            this.data.email !== '' ? query.mail = this.data.email : undefined
            if (query && id) {
                try {
                    let user = await UserSchema.findOneAndUpdate({_id: id}, query, projectionWithNewDocument)
                    if (user) {
                        return {
                            user: user,
                            type: `ok`,
                            message: `${ query.username || query.firstname || query.lastname || query.mail }Modification do with sucess`
                        }
                    } else
                        return {type: 'Error User', message: `Error Can't modify now your informations`}
                } catch (e) {
                    return {type: `Error Internal`, message: `An Internal Error Occured Sorry please try later`}
                }
            }
        }
    }

    async SetAccountToTrue() {
        if (this.data.id !== '' && this.data.token !== '') {
            try {
                let user = await UserSchema.findOne({
                    $and: [
                        {_id: this.data.id.substr(1)},
                        {tokenRegisterEmail: String(this.data.token.substr(1))}, //TODO Test if String Or Not.....
                        {validationWithEmail: false}
                    ]
                })
                if (user) {
                    try {
                        let userTrue = await UserSchema.updateOne({
                                _id: this.data.id.substr(1)
                            },
                            {
                                $set: {
                                    validationWithEmail: true
                                }
                            }, projectionWithNewDocument)
                        if (userTrue) {
                            return {
                                user: userTrue,
                                message: "Hey your account is now valid",
                                type: `Nice`
                            }
                        }
                    } catch (e) {
                        return {type: `Update Error`, message: `An Error Occured during Update`}
                    }
                }

            } catch (e) {
                return {type: `User Error`, message: `User Not Found`}
            }
        }
    }

    async SendReset() {
        if (regexEmail(this.data.email)) {
            try {
                let user = await UserSchema.findOne({mail: this.data.email})
                if (user) {
                    try {
                        sendEmail('resetPass', user._id, user.tokenRegisterEmail, this.data.email)
                        return {title:`Hpertube`,type: `entryPoint`, status:`True`,message: `Instruction for reset pass are sent to ${this.data.email}`}
                    } catch (e) {
                        return {title:`Hpertube`,type: `entryPoint`,status: `False`, message: `The email ${this.data.email} doesn't match`}
                    }
                }
            } catch (e) {
                return {title:`Hpertube`,type: `entryPoint`,status: `False`, message: `An Error Occured... try Later`}
            }
        }
    }

    async Oauth42(req) {
        let url = `https://api.intra.42.fr/oauth/token`
        if (req.query) {
            try {
                AxiosOAuth42.code = req.query.code
                let AxiosPost = await axios.post(url, AxiosOAuth42)
                if (AxiosPost) {
                    try {
                        url = `https://api.intra.42.fr/v2/me`
                        let AxiosGet = await axios.get(url, {
                            headers: {'Authorization': `${AxiosPost.data.token_type} ${AxiosPost.data.access_token}`}
                        })
                        if (AxiosGet) {
                            try {
                                this.data = {
                                    username: AxiosGet.data.login,
                                    email: AxiosGet.data.email,
                                    firstname: AxiosGet.data.first_name,        //TODO Finish actually error with Data when they are tested...
                                    lastname: AxiosGet.data.last_name,          //!FIXME Add Picture to db AiosGet.data.picture try console.log(AiosGet.data)
                                    password: `Robin22Bert`,
                                    confirmPassword:`Robin22Bert`
                                }
                                console.log(this.data)
                                return await this.FindUserOrCreate()
                            } catch (e) {
                                //error find in db or create
                            }
                        }
                    } catch (e) {
                        return {title:`Hperturbe`, message:`Error during Oauth Authentification`, type:`entryPoint`, error:e}
                        //error axiosget
                    }
                }
            } catch (e) {
                return {title:`Hperturbe`, message:`Error during Oauth Authentification`, type:`entryPoint`, error:e}
                //error axiosPost
            }
        }
    }
}
module.exports = User