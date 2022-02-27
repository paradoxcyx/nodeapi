const axios = require('axios');
const cheerio = require('cheerio');

const getpillcolors = async (req, res) => {
    try {
        var allColors = [];
        var htmlData;

        await axios.get('https://www.drugs.com/imprints.php')
        .then(res => {
            const $ = cheerio.load(res.data)
    
            htmlData = res.data;

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
        }).catch(err => console.error(err));

        res.status(200).json({count: allColors.length, message: htmlData, colors: allColors});
    }
    catch (e) {
      console.error(e);
      res.status(500).json({count: 0, message: e, colors: []});
    }
  };

module.exports = {getpillcolors};

