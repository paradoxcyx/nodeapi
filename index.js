const express = require('express');
const app = express();
const port = 3000;

app.get('/book', (req, res) => {
    res.send('success');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));