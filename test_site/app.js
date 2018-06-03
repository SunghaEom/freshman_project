var express = require ('express');
var path = require ('path');
var routes = require ('./routes');
var passport = require ('passport');
var mongoose = require ('mongoose');
var flash = require ('connect-flash');
var morgan = require ('morgan');
var bodyParser = require ('body-parser');
var app = express();

require ('./db/passport')(passport);

var session = require ('express-session');
var MongoStore = require ('connect-mongo')(session);
var mongoUrl = "mongodb://localhost:27017/test";

app.set('port', process.env.PORT || 3000);

/* Setting DB */
mongoose.connect ('mongodb://passport:passport@ds161455.mlab.com:61455/appear');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Conneted mongoDB');
});


/* Setting http */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Setting view */
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);

/* 세션 활성화 */
app.use (session({
    secret: 'secret code',
    resave: true,
    saveUninitialized: true
}));

app.use (flash());

/* Initializing passport */
app.use (passport.initialize());
app.use (passport.session());

/* Setting for static file directory */
app.use(express.static('/public/views'));
app.use (express.static(path.join(__dirname , '/public/stylesheets')));


/* Routing */
app.use ('/', routes);

app.listen(3000, function (){
    console.log ('Connected 3000 port!');
});