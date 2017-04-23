/**
 * Created by rberthie on 4/23/17.
 */
module.exports = {

    protectEntry: data => {
        return(escape(data))
    },

    regexName: name => {
        let reg = /^([a-zA-Z\-èêéàôîïùñç]{2,17})$/
        return reg.test(name);
    },

    regexUsername: username => {
        let reg = /^([a-zA-Z\-0-9_]{4,17})$/
        return reg.test(username)
    },

    regexPassword: pass => {
        //let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})/
        return reg.test(pass)
    },

    regexEmail: email => {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return reg.test(email)
    }


}