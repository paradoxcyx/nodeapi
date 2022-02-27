const axios = require('axios');
const cheerio = require('cheerio');
const got = require('got');

const getpillimprints = async (req, response) => {

    try {

      (async () => {
        try {
            const res = await got('https://www.drugs.com/js/search/?id=livesearch-imprint&s=' + req.query.search);
            
            const $ = cheerio.load(res.body)
            var imprints = [];
  
            $('.ls-item > var').each((index, element) => {
  
                var imprint = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape
  
                imprints.push(imprint);
            });
  
            var returnBody = {
              'count': imprints.length,
              'imprints': imprints
            }

            response.status(200).json(returnBody);
            
        } catch (error) {
            console.log(error.message);
            response.status(500).json({count: 0, message: error.message, imprints: []})
        }
    })();


        res.status(200).json(returnBody);
    }
    catch (e) {
      console.error(e);
      //res.status(500).json(e);
    }
  };

module.exports = {getpillimprints};

