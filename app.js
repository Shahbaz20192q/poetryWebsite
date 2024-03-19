// Assuming you have Admin and User models with Passport-local-mongoose
const passport = require('passport');
// const Admin = require('./server/models/Admin');
const User = require('./server/models/User');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');
const { isActiveRoute } = require('./server/routerHelper/helper')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var poetryRouter = require('./routes/poetry');

var app = express();

connectDB();

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.locals.isActiveRoute = isActiveRoute;

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'Thisissecret'
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport serialization and deserialization for User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passport serialization and deserialization for Admin
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/admin', poetryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;