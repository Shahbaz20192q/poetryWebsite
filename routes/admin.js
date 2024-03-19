var express = require('express');
var router = express.Router();
const adminLayout = '../views/layouts/admin'
const dailyPoetryModel = require('../server/models/admin/daily_upload')
const famousPoetsMulter = require('../server/multer/famous_poet')
const famousPoetModel = require('../server/models/admin/famous_poets')
const allPoetryModel = require('../server/models/admin/Poetry');
// const Poetry = require('../server/models/admin/Poetry');
const multer = require('multer');

/* GET home page. */
// router.get('/', function (req, res) {

//   res.render('admin/admin_dashboard', { title: 'Admin Dashboard', layout: adminLayout });
// });

router.get('/dashboard', isAdmin, async function (req, res) {
  const dailyPoetry = await dailyPoetryModel.find();

  res.render('admin/admin_dashboard', { title: 'Admin Dashboard', dailyPoetry, layout: adminLayout });
});


router.get('/daily/upload',isAdmin, function (req, res) {

  res.render('admin/home_page/upload__form', { title: 'Add Daily Poetry', layout: adminLayout });
});

router.post('/daily/upload', function (req, res) {
  const newDailyPoetry = new dailyPoetryModel({
    poetName: req.body.poetName,
    poetry: req.body.poetry,
  })

  if (!req.body.poetry) {
    req.flash('error', 'please Write Poetry');
    return res.redirect("/admin/daily/upload");
  }
  if (!req.body.poetName) {
    req.flash('poet', 'please enter poet name');
    return res.redirect("/admin/daily/upload");
  } else {
    req.flash('error', 'Thank You :), Poetry Published');
  }
  newDailyPoetry.save();
  res.redirect("/admin/daily/upload");
});

router.get('/daily/upload/delete/:id',isAdmin, async function (req, res) {
  const dailyPoetry = await dailyPoetryModel.findOneAndDelete({ _id: req.params.id })
  res.redirect('/admin/dashboard')
});

router.get('/daily/upload/update/:id',isAdmin, async function (req, res) {
  const dailyPoetry = await dailyPoetryModel.findOne({ _id: req.params.id })
  res.render('admin/home_page/dailyPoetry_update', { dailyPoetry, title: "update daily poetry", layout: adminLayout })
});

router.post('/daily/upload/update/:id', async function (req, res) {
  const dailyPoetry = await dailyPoetryModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      poetName: req.body.poetName,
      poetry: req.body.poetry
    },
    { new: true }
  )

  if (!req.body.poetry) {
    req.flash('error', 'please Write Poetry');
    return res.redirect("/admin/daily/upload/update/" + req.params.id);
  }
  if (!req.body.poetName) {
    req.flash('poet', 'please enter poet name');
    return res.redirect("/admin/daily/upload/update/" + req.params.id);
  } else {
    req.flash('error', 'Poetry Update Successfuly');
  }

  await dailyPoetry.save();
  res.redirect('/admin/dashboard');
});


router.get('/dashboard/famous_poets',isAdmin, async function (req, res) {
  const poets = await famousPoetModel.find();
  res.render('admin/home_page/famous_poets', { title: "add poet", poets, layout: adminLayout })
});

router.get('/dashboard/famous_poets/add',isAdmin, function (req, res) {

  res.render('admin/home_page/add_poet', { title: "add poet", layout: adminLayout })
});

router.post('/dashboard/famous_poets/add', famousPoetsMulter.single('poetImage'), async function (req, res) {
  const newPoet = new famousPoetModel({
    poetName: req.body.poetName,
    poetImage: req.file.filename,
    poetDiscription: req.body.poetDiscription
  })

  await newPoet.save()
  res.render('admin/home_page/add_poet', { title: "add poet", layout: adminLayout })
});

router.get('/dashboard/allPoetry',isAdmin, async function (req, res) {
  const poetry = await allPoetryModel.find()
  res.render("admin/all_poetry", { layout: adminLayout, poetry })
});

router.get('/dashboard/upload/poetry',isAdmin, async function (req, res) {
  const locals = { title: "Add Poetry" }
  res.render("admin/all_poetry_form", { layout: adminLayout, title: locals.title })
});

router.get('/poetry/delete/:id',isAdmin, async function (req, res) {
  await allPoetryModel.findOneAndDelete({ _id: req.params.id });
  res.redirect('/admin/dashboard/allPoetry')
});

router.get('/poetry/update/:id',isAdmin, async function (req, res) {
  const poetry = await allPoetryModel.findOne({ _id: req.params.id });
  res.render('admin/home_page/edit_poetry', { poetry, layout: adminLayout })
});

router.post('/poetry/update/:id', async function (req, res) {
  const poetry = await allPoetryModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      poetName: req.body.poetName,
      poetNameKeyword: req.body.poetNameKeyword,
      category: req.body.category,
      poetry: req.body.poetry,
      nazamTitle: req.body.nazamTitle,
    },
    { new: true }
  );

  await poetry.save()
  res.redirect('/admin/dashboard/allPoetry')
});

router.post('/dashboard/upload/poetry', async function (req, res) {
  const existingTitle = await allPoetryModel.findOne({ nazamTitle: req.body.nazamTitle })
  if (existingTitle) {
    if (existingTitle.nazamTitle === req.body.nazamTitle) {
      req.flash('error', 'Title Already Existing');
      return res.redirect("/admin/dashboard/upload/poetry");
    }
  }
  try {
    const poetry = new allPoetryModel({
      poetName: req.body.poetName,
      poetNameKeyword: req.body.poetNameKeyword,
      category: req.body.category,
      poetry: req.body.poetry,
      nazamTitle: req.body.nazamTitle,
    })

    if (!req.body.poetry) {
      req.flash('error', 'please Write Poetry');
      return res.redirect("/admin/dashboard/upload/poetry");
    }

    if (!req.body.poetNameKeyword) {
      req.flash('error', 'please Write poet Name as a Keyword');
      return res.redirect("/admin/dashboard/upload/poetry");
    }

    if (!req.body.category) {
      req.flash('error', 'please Select a Category');
      return res.redirect("/admin/dashboard/upload/poetry");
    }

    if (!req.body.poetName) {
      req.flash('poet', 'please enter poet name');
      return res.redirect("/admin/dashboard/upload/poetry");
    } else {
      req.flash('error', 'Thank You :), Poetry Published');
    }

    await poetry.save();
    res.redirect('/admin/dashboard/upload/poetry')
  } catch (error) {
    console.log(error)
  }
});

// Delete Poet

router.get('/dashboard/famous_poets/delete/:id',isAdmin, async function (req, res) {
  const id = req.params.id
  const poet = await famousPoetModel.findOneAndDelete({ _id: id });

  res.redirect('/admin/dashboard/famous_poets')
});

router.get('/dashboard/famous_poets/edit/:id',isAdmin, async function (req, res) {
  const id = req.params.id
  const poet = await famousPoetModel.findOne({ _id: id });

  res.render('admin/poet_update', { title: "Update Poet", poet, layout: adminLayout })
});

router.post('/dashboard/famous_poets/edit/:id', famousPoetsMulter.single('poetImage'), async function (req, res) {
  const id = req.params.id

  let updateFields = {
    poetName: req.body.poetName,
    poetDiscription: req.body.poetDiscription,
  };

  if (req.file) {
    updateFields.poetImage = req.file.filename;
  }

  const updatedPoet = await famousPoetModel.findOneAndUpdate(
    { _id: id },
    updateFields,
    { new: true }
  );

  await updatedPoet.save();

  res.redirect('/admin/dashboard/famous_poets');
});


function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect('/');
}
module.exports = router;