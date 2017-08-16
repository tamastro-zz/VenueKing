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

router.get('/add', (req, res) => {
  res.render('addvenue', {
    title: "Add Venue"
  })
})

router.post('/add', (req, res) => {
  db.Venue.create({
    name: `${req.body.name}`,
    quota: `${req.body.quota}`,
    photo: `${req.body.photo}`,
    price: `${req.body.price}`,
    address: `${req.body.alamat}`
  })
  .then(() => {
    res.redirect('/user/profile')
  })
})

module.exports = router