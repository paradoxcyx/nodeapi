const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb+srv://heinrich:namakwa1012@cluster0.i4lw2.mongodb.net/ParadoxGamesDB?retryWrites=true&w=majority', { useUnifiedTopology: true })
.then(client => {
    console.log('Connected to Database')
    console.log('Running CRON Job')  

    const db = client.db('ParadoxGamesDB')
    const gamesCollection = db.collection('Games')

    axios.get('https://dev.to/')
    .then(res => {
        const $ = cheerio.load(res.data)
        $('.crayons-story').each((index, element) => {

            const author = $(element).find('.profile-preview-card__trigger').text().replace(/\s\s+/g, '');
            const blogTitle = $(element).find('.crayons-story__title').text().replace(/\s\s+/g, '');
            const blogLink = $(element).find('a').attr('href');
            const readTime = $(element).find('.crayons-story__tertiary').text();
            const dev = 'https://dev.to';
            const joinedBlogLink = `${dev}` + `${blogLink}`;
          
            var json = { author, blogTitle, blogLink, readTime, dev, joinedBlogLink };

            gamesCollection.insertOne(json);
            console.log('Inserting: ' + json);
        });


    }).catch(err => console.error(err))

   

    cron.schedule('0 0 */3 * * *', function() {
        console.log('running a task every 3 hours');
    });


})
.catch(error => console.error(error));

