require('dotenv').config();

const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const { isActiveRoute } = require('./server/helpers/routerHelpers');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/database');

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to the DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: { maxAge: new Date (Date.now() + (3600000))}
}));

app.use(express.static('public'));

//template engine
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.get('', (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});