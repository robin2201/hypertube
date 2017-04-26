/**
 *
 *  All this modules are using in the route users
 *  All function to create and modify your account
 *
 **/

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
    } //TODO Error wit Pass need to fix it later!!
}
