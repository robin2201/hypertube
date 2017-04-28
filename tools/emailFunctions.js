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

class Mailer {

    constructor(type, data){

        this.data = data
        this.type = type

    }

    createMessage(){
        let subject = ``
        let path = `http://localhost:3000/`

        if(this.type === `resetPass`){
            subject = "✔ Let's go to reset your pass"
            path += `resetPassword/:${this.data.id}/:${this.data.token}`
            
        }else{
            subject = "✔ Let's go to validate your account"
            path += `users/activation/:${this.data.id}/:${this.data.token}`
        }
        return {
            from:`Hypertube register <noreply@hypertube-app.42.fr>`,
            to: this.data.email,
            subject:subject,
            html:`<p>Follow <a href="${path} target="_blank">this link</a> to acess your account</p>`
        }
    }

    async SendEmail(){
        try {
            const message = this.createMessage()
            transporter.verify(() => {
                transporter.sendMail(message, (err, info) => {
                    console.log(`Message ${info.messageId}, sent with response ${info.response}!`)
                    transporter.close()
                })
            })
        }catch (e) {
            console.log(`An error occured when sending mail retry later`)
        }
    }
}

module.exports = Mailer
























//
//
//
// module.exports = {
//
//     async sendEmail (type, id, token, email)  {
//         let link = "http://localhost:3000/users/activation/:"+id+"/:"+token
//         let message = {
//             from : "Hypertube register <noreply@hypertube-app.42.fr>",
//             to : email,
//             subject : "✔ Let's go to validate your account",
//             html : '<p>Follow <a href="' + link + '" target="_blank">this link</a> to activate your account</p>'
//
//         }
//         if(type === 'resetPass'){
//             link = "http://localhost:3000/resetPassword/:"+id+"/:"+token
//             message = {
//                 from : "Hypertube reset Password <noreply@hypertube-app.42.fr>",
//                 to : email,
//                 subject : "✔ Let's go to reset your pass",
//                 html : '<p>Follow <a href="' + link + '" target="_blank">this link</a> to reset your password</p>'
//
//             }
//         }
//
//         transporter.verify(err => {
//             if(err) console.log(err)
//             else{
//                 transporter.sendMail(message, (err, info) => {
//                     if(err) console.log(err)
//                     else{
//                         console.log('Message %s, sent with response %s!', info.messageId, info.response)
//                         transporter.close()
//                     }
//                 })
//             }
//         })
//     }
//}