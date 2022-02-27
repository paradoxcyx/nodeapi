const axios = require('axios');
const cheerio = require('cheerio');
const got = require('got');

const getpillcolors = async (req, response) => {
    try {
        var allColors = [];

        (async () => {
            try {
                const res = await got('https://www.drugs.com/imprints.php');
                
                const $ = cheerio.load(res.body)


                $('#color-select > option').each((index, element) => {
        
                    var colorName = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape
                    var colorID = $(element).attr('value');
                    
                    if (colorID && colorID != '0')
                    {
                        var json = {
                            id: colorID,
                            name: colorName
                        };
            
                        allColors.push(json);
                    }

                    
                    
                });

                response.status(200).json({count: allColors.length, message: 'success', colors: allColors});
                
            } catch (error) {
                console.log(error.message);
                response.status(500).json({count: 0, message: error.message, colors: []})
            }
        })();


    }
    catch (e) {
      console.error(e);
      res.status(500).json({count: 0, message: e, colors: []});
    }
  };

module.exports = {getpillcolors};

