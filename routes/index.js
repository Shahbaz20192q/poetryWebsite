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
const poetryModel = require('../server/models/admin/Poetry')
const url = require('url')


/* GET home page. */
router.get('/', isLoggedIn, async function (req, res) {
  const poets = await famousPoetModel.find();
  const user = await userModel.findOne({ username: req.session.passport.user })
  const dailyPoetry = await dailyPoetryModel.find();
  res.render('index', { title: 'Poetry website', user, dailyPoetry, poets, layout: mainLayout });
});

router.get('/daily/like/:id', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await dailyPoetryModel.findOne({ _id: req.params.id });

  if (poetry.likes.indexOf(user._id) === -1) {
    poetry.likes.push(user._id);
    user.liked.push(poetry._id);
  }
  else {
    poetry.likes.splice(poetry.likes.indexOf(user._id), 1);
    user.liked.splice(user.liked.indexOf(poetry._id), 1)
  }

  await user.save();
  await poetry.save();
  const referringPage = req.headers.referer || '/';
  const redirectURL = url.resolve(req.protocol + '://' + req.get('host'), referringPage);
  res.redirect(redirectURL);
});


router.get('/daily/comment/:id', isLoggedIn, async function (req, res, next) {
  const poets = await famousPoetModel.find();
  const poetry = await dailyPoetryModel.findOne({ _id: req.params.id }).populate('comments');
  res.render('user/comments/daily_comments', { title: 'Comment', poets, layout: mainLayout, poetry });
});

router.post('/daily/comment/:id', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await dailyPoetryModel.findOne({ _id: req.params.id });

  const newComment = new dailyCommentModel({
    comment: req.body.comment,
    user: user._id,
    poetry: poetry._id
  })
  user.comments.push(newComment._id);
  poetry.comments.push(newComment._id);
  await user.save();
  await poetry.save();
  await newComment.save();

  res.redirect('/daily/comment/' + req.params.id)
});


router.get('/poet/:poetName', isLoggedIn, async function (req, res, next) {
  const poets = await famousPoetModel.find();
  const poet = await famousPoetModel.findOne({ poetName: req.params.poetName });
  const user = await userModel.findOne({ username: req.session.passport.user });
  const category = req.params.category;

  res.render('admin/poet', { poets, poet, user, category, layout: poetsLayout })
});

router.get('/poet/:poetName/:category', isLoggedIn, async function (req, res, next) {
  const category = req.params.category;
  const searchNoSpeacialChar = category.replace(/[^a-zA-Z0-9]/g, "")
  const poets = await famousPoetModel.find();
  const poet = await famousPoetModel.findOne({ poetName: req.params.poetName });
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await poetryModel.find({ poetNameKeyword: req.params.poetName, category: { $regex: new RegExp(searchNoSpeacialChar, 'i') } });

  res.render('admin/poet_poetry', { poets, poet, poetry, user, category, layout: poetsLayout })
});


router.get('/write', isLoggedIn, async function (req, res, next) {
  const poets = await famousPoetModel.find();
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await writePoetryModel.find();
  res.render('write', { title: 'Poetry by Poeples', poets, user, layout: mainLayout, poetry });
});

router.post('/write/like/:id', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await writePoetryModel.findOne({ _id: req.params.id });

  if (poetry.likes.indexOf(user._id) === -1) {
    poetry.likes.push(user._id);
    user.liked.push(poetry._id);
  }
  else {
    poetry.likes.splice(poetry.likes.indexOf(user._id), 1);
    user.liked.splice(user.liked.indexOf(poetry._id), 1)
  }

  await poetry.save();
  await user.save();
  const referringPage = req.headers.referer || '/';
  const redirectURL = url.resolve(req.protocol + '://' + req.get('host'), referringPage);
  res.redirect(redirectURL);
});

router.get('/write/upload', isLoggedIn, async function (req, res, next) {
  const poets = await famousPoetModel.find();
  res.render('upload__form', { title: 'Add Poetry', poets, layout: mainLayout });
});

router.get('/write/comment/:id', isLoggedIn, async function (req, res, next) {
  const poets = await famousPoetModel.find();
  const poetry = await writePoetryModel.findOne({ _id: req.params.id }).populate('comments');
  res.render('user/comments/write_comments', { title: 'Comment', poets, layout: mainLayout, poetry });
});

router.post('/write/comment/:id', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await writePoetryModel.findOne({ _id: req.params.id });

  const newComment = new commentModel({
    comment: req.body.comment,
    user: user._id,
    poetry: poetry._id
  })
  user.comments.push(newComment._id);
  poetry.comments.push(newComment._id);
  await user.save();
  await poetry.save();
  await newComment.save();

  res.redirect('/write/comment/' + req.params.id)
});

router.post('/write/upload', async function (req, res, next) {
  let newPoem = new writePoetryModel({
    poetName: req.body.poetName,
    poetry: req.body.poetry,
    userName: req.user.username
  })

  if (!req.body.poetry) {
    req.flash('error', 'please Write Poetry');
    return res.redirect("/write/upload");
  }
  if (!req.body.poetName) {
    req.flash('poet', 'please enter poet name');
    return res.redirect("/write/upload");
  } else {
    req.flash('error', 'Thank You :), Poetry Published');
  }
  await newPoem.save();
  res.redirect("/write/upload");
});

router.get('/all/:category', isLoggedIn, async function (req, res, next) {
  const category = req.params.category;
  const searchNoSpeacialChar = category.replace(/[^a-zA-Z0-9]/g, "")
  const poets = await famousPoetModel.find();
  const poet = await famousPoetModel.findOne({ poetName: req.params.poetName });
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await poetryModel.find({ category: { $regex: new RegExp(searchNoSpeacialChar, 'i') } });

  res.render('user/poetry', { poets, poet, category, poetry, user, layout: mainLayout })
});

router.get('/single_poetry/:id', isLoggedIn, async function (req, res, next) {
  const id = req.params.id;
  const poets = await famousPoetModel.find();
  const poet = await famousPoetModel.findOne({ poetName: req.params.poetName });
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await poetryModel.findOne({ _id: id });

  res.render('user/single_poetry', { poets, poet, poetry, user, layout: mainLayout, title: poetry.nazamTitle })
});

router.get('/poetry/comment/:id', isLoggedIn, async function (req, res, next) {
  const poets = await famousPoetModel.find();
  const poetry = await poetryModel.findOne({ _id: req.params.id }).populate('comments');
  res.render('user/comments/comments', { title: 'Comment', poets, layout: mainLayout, poetry });
});

router.post('/poetry/comment/:id', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await poetryModel.findOne({ _id: req.params.id });

  const newComment = new dailyCommentModel({
    comment: req.body.comment,
    user: user._id,
    poetry: poetry._id
  })
  user.comments.push(newComment._id);
  poetry.comments.push(newComment._id);
  await user.save();
  await poetry.save();
  await newComment.save();

  const referringPage = req.headers.referer || '/';
  const redirectURL = url.resolve(req.protocol + '://' + req.get('host'), referringPage);
  res.redirect(redirectURL);
});

// Main Poetry like route

router.post('/poetry/like/:id', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const poetry = await poetryModel.findOne({ _id: req.params.id });

  if (poetry.likes.indexOf(user._id) === -1) {
    poetry.likes.push(user._id);
    user.liked.push(poetry._id);
  }
  else {
    poetry.likes.splice(poetry.likes.indexOf(user._id), 1);
    user.liked.splice(user.liked.indexOf(poetry._id), 1)
  }

  await user.save();
  await poetry.save();
  const referringPage = req.headers.referer || '/';
  const redirectURL = url.resolve(req.protocol + '://' + req.get('host'), referringPage);
  res.redirect(redirectURL);
});

// Middel Ware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/register')
}

module.exports = router;