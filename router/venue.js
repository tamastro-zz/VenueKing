const express = require('express')
const router = express.Router()
const db = require('../models');

router.get('/', (req, res) => {
  db.Venue.findAll()
    .then(ven => {
      res.render('venue', {
        data: ven
      })
    })
})

router.post('/', (req, res) => {
  req.session.user.tgl = req.body.date
  res.redirect(`/venue/${req.body.id}`)
})

router.get('/:idv', (req, res) => {
  thisID = parseInt(req.params.idv)
  db.Venue.findOne({
      where: {
        id: thisID
      }
    })
    .then(venue => {
      db.UserVenue.findAndCountAll({
          where: {
            date: req.session.user.tgl,
            VenueId: req.params.idv,
            active: true
          },
          include: [db.User]
        })
        .then(result => {
          res.render('venuedetail', {
            data: venue,
            count: result.count,
            result: result.rows,
            role: req.session.user.role
          })
        })
    })
})

router.post('/:idv', (req, res) => {
  let iniId = parseInt(req.params.idv)
  db.UserVenue.create({
      VenueId: iniId,
      UserId: req.session.user.id,
      active: req.body.active,
      date: `${req.session.user.tgl}`
    })
    .then(() => {
      res.redirect(`/venue/${iniId}`)
    })
})

router.get('/edit/:idv', (req, res) => {
  db.Venue.findOne({
    where: {
      id: req.params.idv
    }
  })
    .then(ven => {
      res.render('editV', {
        edit: ven,
      })
    })
})

router.post('/edit/:idv', (req, res) => {
  db.Venue.update({
    name: `${req.body.name}`,
    quota: `${req.body.quota}`,
    photo: `${req.body.photo}`,
    price: `${req.body.price}`,
    address: `${req.body.alamat}`,
    updatedAt: new Date()
  }, {
      where: {
        id: req.params.idv
      }
    })
    .then(() => {
      res.redirect(`/venue/${req.params.idv}`)
    })
})

router.get('/delete/:idv', (req, res) => {
  db.UserVenue.destroy({
      where: {
        VenueId: req.params.idv
      }
    })
    .then(() => {
      db.Venue.destroy({
          where: {
            id: req.params.idv
          }
        })
        .then(() => { 
          res.redirect('/venue')
        })
    })
})

router.use((req, res, next) => {
  if (req.session.user.role == 'owner') {
    next();
  } else {
    res.redirect('/profile');
  }
})

router.get('/add/venue', (req, res) => {
  res.render('addvenue', {
    title: "Add Venue"
  })
})

router.post('/add/venue', (req, res) => {
  db.Venue.create({
      name: `${req.body.name}`,
      quota: `${req.body.quota}`,
      photo: `${req.body.photo}`,
      price: `${req.body.price}`,
      address: `${req.body.alamat}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .then(() => {
      res.redirect('/user/profile')
    })
})

module.exports = router