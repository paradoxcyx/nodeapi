const express = require('express');
const app = express();

app.use(express.json());

const MongoClient = require('mongodb').MongoClient

  MongoClient.connect('mongodb+srv://heinrich:namakwa1012@cluster0.i4lw2.mongodb.net/ParadoxGamesDB?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('ParadoxGamesDB')
    const gamesCollection = db.collection('Games')

    app.post('/quotes/create', (req, res) => {
        gamesCollection.insertOne(req.body)
          .then(result => {
            res
            .status(200)
            .send(result)
            .end();
          })
          .catch(error => console.error(error))
      })

      app.get('/quotes', (req, res) => {
        gamesCollection.find({}).toArray(function(err, quotes) {
            res.status(200).json({'quotes' : quotes});
        });
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

