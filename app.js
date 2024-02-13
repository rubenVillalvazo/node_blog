require('dotenv').config();

const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/database');
const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to the DB
connectDB();

app.use(express.static('public'));

//template engine
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));

app.get('', (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});