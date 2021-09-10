var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
require('./config/authenticate');

var animalRouter = require('./routes/animalRoutes');
var authRouter = require('./routes/authRoutes');
var inventoryRouter = require('./routes/inventoryRoutes');
var workerRouter = require('./routes/workerRoutes');
var taskRouter = require('./routes/taskRoutes');

require('dotenv').config({ path: `${__dirname}/config/.env` });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({ credentials: true, origin: true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use('/', authRouter);
app.use('/animals',passport.authenticate('jwt', {session: false}), animalRouter);
app.use('/inventory', passport.authenticate('jwt', {session: false}),inventoryRouter);
app.use('/workers', passport.authenticate('jwt', {session: false}),workerRouter);
app.use('/tasks', passport.authenticate('jwt', {session: false}),taskRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true,
  keepAlive: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  useFindAndModify: false,
  useUnifiedTopology: true
}

const connect = () => {
  mongoose.connect(process.env.MONGO_URI, options)
  .then(res => {
    console.log('connection to server alive on port: ' +port);
  },err => next(err))
  .catch(err => console.log(err))

}
var port = process.env.PORT || 5000;
app.listen(port);
connect();

module.exports = app;
