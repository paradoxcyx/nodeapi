const axios = require('axios');
const cheerio = require('cheerio');

const getpillimprints = async (req, res) => {

    try {
      var returnBody = {};

      await axios.get('https://www.drugs.com/js/search/?id=livesearch-imprint&s=' + req.query.search)
        .then(res => {
          const $ = cheerio.load(res.data)
          var imprints = [];

          $('.ls-item > var').each((index, element) => {

              var imprint = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape

              imprints.push(imprint);
          });

          returnBody = {
            'count': imprints.length,
            'imprints': imprints
          }
          

        }).catch(err => console.error(err));

        res.status(200).json(returnBody);
    }
    catch (e) {
      console.error(e);
      //res.status(500).json(e);
    }
  };

module.exports = {getpillimprints};

