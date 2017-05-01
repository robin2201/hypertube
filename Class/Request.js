/**
 * Created by rberthie on 5/1/17.
 */
const request = request('request')
const {maxWebRequest, webRequestTimeout} = require('../Config/constants')


class Request {

    constructor(header, url){
        this.headers = header
        this.url = url
        this.request = request.defaults({
            "headers": {
                "Content-Type": this.headers
            },
            "baseUrl": this.url,
            "timeout": webRequestTimeout * 1000
        })
    }

    async MakeRequest(){
        try{
            return await this.request(this.url)
        }catch(e){
            return(e)
        }
    }
}