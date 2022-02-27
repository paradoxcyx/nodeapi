const axios = require('axios');
const cheerio = require('cheerio');
const got = require('got');

const getpillshapes = async (req, response) => {
    try {
        var allShapes = [];

        (async () => {
            try {
                const res = await got('https://www.drugs.com/api/pill-id/pill-shapes.html');
                
                const $ = cheerio.load(res.body)

    
                $('.pill-shape').each((index, element) => {
        
                    var pillShape = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape
                    var pillID = $(element).attr('data-shape-id');
        
                    var json = {
                        id: pillID,
                        shape: pillShape
                    };
        
                    allShapes.push(json);
                });  
                
                response.status(200).json({count: allShapes.length, message: 'Success', colors: allShapes});
                
            } catch (error) {
                console.log(error.message);
                response.status(500).json({count: 0, message: error.message, shapes: []})
            }
        })();

    }
    catch (e) {
      console.error(e);
      res.status(500).json({count: 0, message: e, colors: []});
    }
  };

module.exports = {getpillshapes};

