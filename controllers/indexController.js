/**
 * Created by robin on 4/18/17.
 */
module.exports = {

    renderIndex: (req, res) => {
        res.render('index', {
            title: 'Hypertube'
        })
    },

    register: (req, res) => {

    },

    signin: (req, res) => {

    },

    oAuth42: (req, res) => {

    },

    oAuthGoogle: (req, res) => {

    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (!err) res.redirect('/')
        })
    }
}