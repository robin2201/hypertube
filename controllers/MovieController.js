const Scrap = require('../Scrapper/Scrapper')


module.exports = {

    ScrapMovie: (req, res) =>{
        let scrap = new Scrap()
        scrap.scrape()
            .then(x => {
            console.log(`HErre ${x}`)
        })
    },

}