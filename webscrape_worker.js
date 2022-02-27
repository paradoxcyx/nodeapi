const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://heinrich:namakwa1012@cluster0.i4lw2.mongodb.net/ParadoxGamesDB?retryWrites=true&w=majority', { useUnifiedTopology: true })
.then(client => {
    console.log('Connected to Database');
    console.log('Running CRON Job');  

    const db = client.db('ParadoxGamesDB');
    const pillShapesCollection = db.collection('drug-pill-shapes');
    const pillColorsCollection = db.collection('drug-pill-colors');

    pillShapesCollection.deleteMany();
    pillColorsCollection.deleteMany();

    //ProcessPillShapesWebScrape(pillShapesCollection);
    //ProcessPillColorsWebScrape(pillColorsCollection);
    //ProcessWebScrape(gamesCollection);


    cron.schedule('0 0 */3 * * *', function() {
        pillShapesCollection.deleteMany();
        pillColorsCollection.deleteMany();

        //ProcessPillShapesWebScrape(gamesCollection);
    });


})
.catch(error => console.error(error));

function ProcessPillColorsWebScrape(collection)
{
    axios.get('https://www.drugs.com/imprints.php')
    .then(res => {
        const $ = cheerio.load(res.data)

        var allGames = [];

        $('#color-select > option').each((index, element) => {

            var colorName = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape
            var colorID = $(element).attr('value');
            
            if (colorID && colorID != '0')
            {
                var json = {
                    id: colorID,
                    name: colorName
                };
    
                allGames.push(json);
            }
            
        });

        collection.insertMany(allGames);
        allGames = [];



    }).catch(err => console.error(err));
}


function ProcessPillShapesWebScrape(collection)
{
    axios.get('https://www.drugs.com/api/pill-id/pill-shapes.html')
    .then(res => {
        const $ = cheerio.load(res.data)

        var allGames = [];

        $('.pill-shape').each((index, element) => {

            var pillShape = $(element).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // PillShape
            var pillID = $(element).attr('data-shape-id');

            var json = {
                id: pillID,
                shape: pillShape
            };

            allGames.push(json);
        });

        collection.insertMany(allGames);
        allGames = [];



    }).catch(err => console.error(err));
}

