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
      db.UserVenue.findAll({
          where: {
            UserId: req.session.user.id
          },
          include: [db.Venue]
        })
        .then(venue => {
          res.render('profile', {
            data: user,
            venue: venue,
            role: req.session.user.role
          })
        })
    })
})

router.post('/profile', (req, res) => {
  db.UserVenue.findAll({
      order: [
        ['createdAt', 'ASC']
      ],
      where: {
        VenueId: req.body.venueid,
        active: false
      },
      limit: 1
    })
    .then(data => {
      db.UserVenue.destroy({
          where: {
            UserId: req.session.user.id,
            unique: req.body.unique
          }
        })
        .then(() => {
          if (data[0] === undefined) {
            res.redirect('/user/profile')
          } else {
            db.UserVenue.update({
                active: true
              }, {
                where: {
                  unique: data[0].unique
                }
              })
              .then(() => {
                res.redirect('/user/profile')
              })
          }
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

router.get('/profile/delete', (req, res) => {
  db.User.destroy({
      where: {
        id: req.session.user.id
      }
    })
    .then(() => {
      db.UserVenue.destroy({
          where: {
            UserId: req.session.user.id
          }
        })
        .then(() => {
          req.session.destroy()
          res.redirect('/')
        })
    })
})

module.exports = router