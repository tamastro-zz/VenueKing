const express = require('express')
const router = express.Router()
const setup = require('../models');

router.get('/', (req, res) => {
    res.render('venue', { title: 'VenueKing' })
})

module.exports = router