var express = require('express');
var router = express.Router();
const mainLayout = '../views/layouts/main';
const poetsLayout = '../views/layouts/poets';
const userRouter = require('./users');
const userModel = require('../server/models/User')
const writePoetryModel = require('../server/models/WritePoetry');
const commentModel = require('../server/models/Comment');
const dailyCommentModel = require('../server/models/DailyComment')
const dailyPoetryModel = require('../server/models/admin/daily_upload')
const famousPoetModel = require('../server/models/admin/famous_poets')


/* GET home page. */
// router.get('/', isLoggedIn, async function (req, res) {
//   const poets = await famousPoetModel.find();
//   const user = await userModel.findOne({ username: req.session.passport.user })
//   const dailyPoetry = await dailyPoetryModel.find();
//   res.render('index', { title: 'Poetry website', user, dailyPoetry, poets});
// });



// Middel Ware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/register')
}

module.exports = router;