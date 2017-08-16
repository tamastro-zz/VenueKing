const express = require('express')
const router = express.Router()
const db = require('../models');
const random = require('../views/helper/randomizer');

router.get('/profile', (req, res) => {
  db.User.findOne({
      where: {
        id: req.session.user.id
      }
    })
    .then(user => {
      res.render('profile', {
        data: user,
        role: req.session.user.role
      })
    })
})

router.get('/profile/edit', (req, res) => {
  db.User.findOne({
    where: {
      id: req.session.user.id
    }
  })
    .then(editP => {
      res.render('edit', {
        editUser: editP,
      })
    })
})

router.post('/profile/edit', (req, res) => {
  db.User.update({
    fullname: `${req.body.name}`,
    email: `${req.body.email}`,
    updatedAt: new Date()
  }, {
      where: {
        id: req.session.user.id
      }
    })
    .then(() => {
      res.redirect('/user/profile')
    })
})

router.get('/profile/editpassword', (req, res) => {
  db.User.findOne({
      where: {
        id: req.session.user.id
      }
    })
    .then(user => {
      res.render('editpassword', {
        data: user,
        errs: req.query.errs
      })
    })
})

router.post('/profile/editpassword', (req, res) => {
  db.User.findOne({
      where: {
        id: req.session.user.id
      }
    })
    .then(data => {
      if (random.hashish(`${data.salt}`, `${req.body.passwordlama}`) == `${data.password}`) {
        if (req.body.passwordbaru == req.body.confpasswordbaru) {
          db.User.update({
            password: random.hashish(`${data.salt}`, `${req.body.passwordbaru}`)
          }, {
            where: {
              id: req.session.user.id
            }
          })
          res.redirect('/user/profile')
        } else {
          res.redirect(`/user/profile/editpassword?errs=Password Not Match`)
        }
      } else {
        res.redirect(`/user/profile/editpassword?errs=Old Password Wrong`)
      }
    })
})

module.exports = router