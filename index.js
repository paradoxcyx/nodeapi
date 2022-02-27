const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

app.use(express.json());

/*
Search by Imprint, Color and Shape:
'https://www.drugs.com/imprints.php?imprint=&color=&shape=&maxrows=100000'

Search by Drug Name
https://www.drugs.com/imprints.php?drugname=as

*/
const MongoClient = require('mongodb').MongoClient

  MongoClient.connect('mongodb+srv://heinrich:namakwa1012@cluster0.i4lw2.mongodb.net/ParadoxGamesDB?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('ParadoxGamesDB')
    const pillShapesCollection = db.collection('drug-pill-shapes')
    const pillColorsCollection = db.collection('drug-pill-colors')

//https://www.drugs.com/js/search/?id=livesearch-imprint&s=23
//https://www.drugs.com/imprints.php?drugname=as

      app.post('/pillidentifier', async (req, res) => {
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

          await axios.get(url)
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
              

            }).catch(err => console.error(err));

            res.status(200).json(returnBody);

        }
        catch (e) {
          console.error(e);
          res.status(500).json({count: 0, message: e, pills: []});
        }
      })


      app.get('/getpillcolors', (req, res) => {

        try {
          
          pillColorsCollection.find({}, { projection: { _id: 0, id: 1, name: 1 } }).toArray(function(err, pillColors) {
  
            var returnBody = {
              'count': pillColors.length,
              'colors': pillColors
            }
            res.status(200).json(returnBody);
          });
        }
        catch (e) {
          console.error(e);
        }
      })


      app.get('/getpillimprints', async (req, res) => {

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
      })

      app.get('/getpillshapes', (req, res) => {

        try {
          
          pillShapesCollection.find({}, { projection: { _id: 0, id: 1, shape: 1 } }).toArray(function(err, pillshapes) {
  
            var returnBody = {
              'count': pillshapes.length,
              'shapes': pillshapes
            }
            res.status(200).json(returnBody);
          });
        }
        catch (e) {
          console.error(e);
        }
      })

  })
  .catch(error => console.error(error))

  
app.get('/', (req, res) => {
    res
      .status(200)
      .send('Hello server is running')
      .end();
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });

