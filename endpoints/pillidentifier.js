const axios = require('axios');
const cheerio = require('cheerio');
const got = require('got');

const pillidentifier = async (req, response) => {
    try {
      var url = '';
      var returnBody = {};

      var imprint = req.query.imprint;
      var drugName = req.query.drugname;
      var color = req.query.color;
      var shape = req.query.shape;
      var maxRows = req.query.maxrows;

      if (!imprint)
      {
        imprint = '';
      }

      if (!color)
      {
        color = '';
      }

      if (!shape)
      {
        shape = '0';
      }
      
      url = 'https://www.drugs.com/imprints.php?imprint=' + imprint + '&color=' + color + '&shape=' + shape + '&drugname=' + drugName + '&maxrows=100000';

      //#content > div.contentBox > div.ddc-pid-list > div

      (async () => {
        try {
            const res = await got(url);
            
            const $ = cheerio.load(res.body)
            var pills = [];
              
  
            $('#content > div.contentBox > div.ddc-pid-list > div.ddc-pid-card').each((index, element) => {
  
                var imgURL = $(element).find('div.ddc-pid-img').attr('data-image-src');
                var pillImprint = $(element).find('div.ddc-pid-card-header > h2').text();
  
                var details = $(element).find('div.ddc-pid-details > ul.ddc-list-unstyled > li');
  
                var drug = $(details[0].children[2]).text().trim();
                var strength = $(details[1]).text().replace('Strength: ', '').trim();
                var color = $(details[3]).text().replace('Color: ', '').trim();
                var shape = $(details[4]).text().replace('Shape: ', '').trim();
  
                var pill = {
                  imageURL: imgURL,
                  imprint: pillImprint,
                  drug,
                  strength,
                  color,
                  shape
                };
  
                pills.push(pill);
            });
  
         
            returnBody = {
              'count': pills.length,
              'message': 'Sucessfully retrieved pills',
              'pills': pills
            }
  
            return response.status(200).json(returnBody);

            
        } catch (error) {
            console.log(error.response.body);
            response.status(500).json({count: 0, message: error.response.body, pills: []})
        }
    })();

/*       await axios.get(url)
        .then(res => {
          const $ = cheerio.load(res.data)
          var pills = [];
            

          $('#content > div.contentBox > div.ddc-pid-list > div.ddc-pid-card').each((index, element) => {

              var imgURL = $(element).find('div.ddc-pid-img').attr('data-image-src');
              var pillImprint = $(element).find('div.ddc-pid-card-header > h2').text();

              var details = $(element).find('div.ddc-pid-details > ul.ddc-list-unstyled > li');

              var drug = $(details[0].children[2]).text().trim();
              var strength = $(details[1]).text().replace('Strength: ', '').trim();
              var color = $(details[3]).text().replace('Color: ', '').trim();
              var shape = $(details[4]).text().replace('Shape: ', '').trim();

              var pill = {
                imageURL: imgURL,
                imprint: pillImprint,
                drug,
                strength,
                color,
                shape
              };

              pills.push(pill);
          });

       
          returnBody = {
            'count': pills.length,
            'message': 'Sucessfully retrieved pills',
            'pills': pills
          }

          return response.status(200).json(returnBody);
          

        }).catch(err => response.status(500).json({count: 0, message: err.message, pills: []}));
 */

    }
    catch (e) {
      console.error(e);
      return response.status(500).json({count: 0, message: e.message, pills: []});
    }
  };

module.exports = {pillidentifier};

