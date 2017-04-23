/**
 *
 * All this module are used in the Index Routew
 * Only render views
 * Logout function
 *
 */

module.exports = {

    login: (req, res) => {
        res.render('index', {
            title: 'Hypertube',
            type: "login"
        })
    },

    index: (req, res) => {
        res.render('index', {
            title: 'Hypertube',
            type: "entryPoint"
        })
    },

    register: (req, res) => {
        res.render('index', {
            title: 'Hypertube',
            type: "register"
        })
    },

    logout: (req, res) => {
        if(req.session){
            req.session.destroy(err => {
                if(!err){
                    res.redirect('/')
                }
            })
        }
    },

    forget: (req, res) => {
        res.render('index', {
            title:'Hypertube',
            type:'forget',
            action:"sendInstruction"
        })
    },

    resetPass: (req, res) => {
        let {id, token} = req.params
        id = id.substr(1)
        token = token.substr(1)

        res.render('index', {
            title:'Hypertube',
            type:'forget',
            action:"resetPass",
            IdToken: {
                id:id,
                token:token
            }

        })
    }


}