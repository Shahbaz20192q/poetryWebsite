// var express = require('express');
// var router = express.Router();

// const userRouter = require('../../routes/users')
// const adminRouter = require('../../routes/admin')

// // admin authenticate
// function isLoggedInAdmin(req, res, next) {
//     if (req.isAuthenticated() && req.user instanceof adminRouter) {
//         return next();
//     }
//     res.redirect('/admin');
// }

// function isLoggedInUser(req, res, next) {
//     if (req.isAuthenticated() && req.user instanceof userRouter) {
//         return next();
//     }
//     res.redirect('/users/register');
// }

// module.exports = {
//     isLoggedInAdmin,
//     isLoggedInUser
// }