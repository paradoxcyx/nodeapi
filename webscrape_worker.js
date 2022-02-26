const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://heinrich:namakwa1012@cluster0.i4lw2.mongodb.net/ParadoxGamesDB?retryWrites=true&w=majority', { useUnifiedTopology: true })
.then(client => {
    console.log('Connected to Database');
    console.log('Running CRON Job');  

    const db = client.db('ParadoxGamesDB');
    const gamesCollection = db.collection('Games');
    
    gamesCollection.deleteMany();

    ProcessWebScrape(gamesCollection);

    cron.schedule('0 0 */3 * * *', function() {
        gamesCollection.deleteMany();
        ProcessWebScrape(gamesCollection);
    });


})
.catch(error => console.error(error));



function ProcessWebScrape(gamesCollection)
{
    var allGames = [];

    for (let year = 2000; year <= 2022; year++) {
        axios.get('https://www.game-debate.com/games?year=' + year)
        .then(res => {
            const $ = cheerio.load(res.data)
            $('body > main > div.game-list-container > div.games-list-table > table > tbody > tr').each((index, element) => {
    
                var name = $($(element).find('td')[0]).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // Game Name
                var release = $($(element).find('td')[2]).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // Release
                var genre = $($(element).find('td')[3]).text().replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim(); // Genre
    
                var json = {
                    gameName: name,
                    gameRelease: release,
                    gameGenre: genre
                };
    
                allGames.push(json);
            });

            gamesCollection.insertMany(allGames);
            allGames = [];

            console.log('Completed Year: ' + year);
    
    
        }).catch(err => console.error(err));

        
      }
      

}