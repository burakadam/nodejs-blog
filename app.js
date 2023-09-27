require('dotenv').config();


const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mainRouter = require('./server/routes/main');
const adminRouter = require('./server/routes/admin');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');



const connectDB = require('./server/config/db');
const session = require('express-session');

const app = express();
const PORT = 5001 || process.env.PORT;

//Connect db
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
  store:MongoStore.create({
    mongoUrl:process.env.MONGODB_URI
  })
}))

// Template engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', mainRouter);
app.use('/', adminRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
