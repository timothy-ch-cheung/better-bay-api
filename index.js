const express = require('express');

const app = express();

const port = 3000;

app.get('/v1/items/cheapest', (req, res) => {
    res.send('WIP come back later!');
});

app.listen(port, () => console.log(`Better Bay API listening on port ${port}!`))