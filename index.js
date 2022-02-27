const express = require('express');
const app = express();
app.use(express.json());

const pillIdentifierController = require('./endpoints/pillidentifier'); 
const pillColorsController = require('./endpoints/getpillcolors'); 
const pillImprintsController = require('./endpoints/getpillimprints'); 
const pillShapesController = require('./endpoints/getpillshapes'); 
/*
Search by Imprint, Color and Shape:
'https://www.drugs.com/imprints.php?imprint=&color=&shape=&maxrows=100000'

Search by Drug Name
https://www.drugs.com/imprints.php?drugname=as

*/
/* const MongoClient = require('mongodb').MongoClient

  MongoClient.connect('mongodb+srv://heinrich:namakwa1012@cluster0.i4lw2.mongodb.net/ParadoxGamesDB?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('ParadoxGamesDB')

      app.post('/pillidentifier', pillIdentifierController.pillidentifier);
      app.get('/getpillcolors', pillColorsController.getpillcolors);
      app.get('/getpillimprints', pillImprintsController.getpillimprints);
      app.get('/getpillshapes', pillShapesController.getpillshapes);

  })
  .catch(error => console.error(error)) */

  app.post('/pillidentifier', pillIdentifierController.pillidentifier);
  app.get('/getpillcolors', pillColorsController.getpillcolors);
  app.get('/getpillimprints', pillImprintsController.getpillimprints);
  app.get('/getpillshapes', pillShapesController.getpillshapes);

  app.get('/', (req, res) => {
    res
      .status(200)
      .send('Paradox\' Drugs Database')
      .end();
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });

