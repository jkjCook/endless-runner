const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(HTTP_PORT, () => {
    console.log('Listening on port', HTTP_PORT);
});
