var express = require('express');
var router = express.Router();
const userSchema = require('../server/models/User');
const passport = require('passport');
const famousPoetModel = require('../server/models/admin/famous_poets')

const LocalStrategy = require('passport-local')
passport.use(new LocalStrategy(userSchema.authenticate()));

router.get('/register', async function (req, res, next) {
  const poets = await famousPoetModel.find();

  res.render('user/form', { title: "Register", poets })
})

/* Post users listing. */

router.post('/register', async function (req, res, next) {
  try {
    let existingUser = await userSchema.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
    if (existingUser) {
      if (existingUser.email === req.body.email) {
        req.flash('rerror', 'Email is already registered');
      } else {
        req.flash('rerror', 'Username is already taken');
      }
      return res.redirect('/users/register');
    }

    if (!req.body.username && !req.body.email && !req.body.password, !req.body.username || !req.body.email || !req.body.password) {
      req.flash('rerror', 'Please Fill All  Fields!')
      return res.redirect('/users/register')
    }

    let userData = new userSchema({
      username: req.body.username,
      email: req.body.email
    })
    userSchema.register(userData, req.body.password)
      .then(function () {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/')
        })
      })
  } catch (error) {
    req.flash("rerror", error)
    console.log(error)
    res.redirect('/users/register')
  }
});



router.post('/login', passport.authenticate("local", {
  failureFlash: true,
  successFlash: true,
  successRedirect: '/',
  failureRedirect: '/users/register'
}));

// log Out
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/users/register')
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/admin')
}

module.exports = router;