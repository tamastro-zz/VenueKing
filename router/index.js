const express = require('express')
const router = express.Router()
const db = require('../models');
const crypto = require('crypto');
const random = require('../views/helper/randomizer');

router.get('/', (req, res) => {
  res.render('index', {
    title: 'VenueKing'
  })
})

router.get('/register', (req, res) => {
  res.render('register', {
    errs: req.query.errs
  })
})

router.post('/register', (req, res) => {
  if (req.body.password == req.body.retype) {
    db.User.create({
        username: `${req.body.username}`,
        password: `${req.body.password}`,
        fullname: `${req.body.name}`,
        email: `${req.body.email}`,
        role: `${req.body.role}`,
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .then(() => {
        res.redirect('/')
      })
      .catch((err) => {
        res.redirect(`/register?errs=${err.errors[0].message}`)
      })
  } else {
    res.redirect(`/register?errs=Password not Match`)
  }
})

router.get('/login', (req, res) => {
  res.render('login', {
    errs: req.query.errs
  })
})

router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.redirect(`/login?errs=Form Incomplete`)
  } else {
    db.User.findOne({
        where: {
          username: req.body.username
        }
      })
      .then(rows => {
        var saltUserLogin = rows.salt
        var passwordUserLogin = req.body.password
        var getPasswordUser = random.hashish(saltUserLogin, passwordUserLogin)
        if (rows.password == getPasswordUser) {
          req.session.user = {
            id: rows.id,
            username: req.body.username,
            role: rows.role
          }
          res.redirect('/homepage')
        } else {
          res.redirect(`/login?errs=Wrong Password`)
        }
      })
      .catch(() => {
        res.redirect(`/login?errs=Username Not Found`)
      })
  }
})

// batas bebas
router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(403);
  }
})

router.get('/homepage', function (req, res) {
  res.render('homepage', {
    title: `WELCOME ${req.session.user.username}`,
    role: req.session.user.role,
    name: req.session.user.username
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router