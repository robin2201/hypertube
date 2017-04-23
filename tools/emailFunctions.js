/**
 * Created by rberthie on 4/23/17.
 */
const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '33c9502726c803',
        pass: '3261b4bf3cd7a2'
    }
})

module.exports = {

    sendEmail: (type, id, token, email) => {
        let link = "http://localhost:3000/users/activation/:"+id+"/:"+token
        let message = {
            from : "Hypertube register <noreply@hypertube-app.42.fr>",
            to : email,
            subject : "✔ Let's go to validate your account",
            html : '<p>Follow <a href="' + link + '" target="_blank">this link</a> to activate your account</p>'

        }
        if(type === 'resetPass'){
            link = "http://localhost:3000/resetPassword/:"+id+"/:"+token
            message = {
                from : "Hypertube reset Password <noreply@hypertube-app.42.fr>",
                to : email,
                subject : "✔ Let's go to reset your pass",
                html : '<p>Follow <a href="' + link + '" target="_blank">this link</a> to reset your password</p>'

            }
        }

        transporter.verify(err => {
            if(err) console.log(err)
            else{
                transporter.sendMail(message, (err, info) => {
                    console.log('Message %s, sent with response %s!', info.messageId, info.response)
                    transporter.close()
                })
            }
        })
    }
}