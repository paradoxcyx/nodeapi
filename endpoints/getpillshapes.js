const axios = require('axios');
const cheerio = require('cheerio');

const getpillshapes = async (req, res) => {
    try {
        var allShapes = [];

        await axios.get('https://www.drugs.com/api/pill-id/pill-shapes.html')
        .then(res => {
            const $ = cheerio.load(res.data)

    
            $('.pill-shape').each((index, element) => {
    
                var pillShape = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape
                var pillID = $(element).attr('data-shape-id');
    
                var json = {
                    id: pillID,
                    shape: pillShape
                };
    
                allShapes.push(json);
            });
        }).catch(err => console.error(err));

        res.status(200).json({count: allShapes.length, message: 'Success', colors: allShapes});

    }
    catch (e) {
      console.error(e);
      res.status(500).json({count: 0, message: e, colors: []});
    }
  };

module.exports = {getpillshapes};

