const express = require("express");
const app = express();
const port = 5000;
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/test', (req, res) => {
    res.send('Testing!');
})

app.listen(port, () => {
    console.log("Server is listening");
})