const YTS = require('./provider/YTS')

class Scraper{

    async scrapeYTS() {
        try {
            const yts = new YTS("YTS")
            return await yts.parse()
        } catch (err) {
            return console.log(err)
        }
    }

    async scrape(){
        try{
            return await this.scrapeYTS()  //TODO Add other scrap engine
        } catch (e){
            return console.log(`Eroor during Scrapping`)
        }
    }

}

module.exports = Scraper