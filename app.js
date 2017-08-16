const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const valid = require('express-validator');
const crypto = require('crypto');


//router

var index = require('./router/index');
var routerUser = require('./router/user');
var routerVenue = require('./router/venue');


var app = express();


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(valid())
app.use(session({
  secret: 'VK',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))


app.use('/', index)

app.use((req, res, next) => {
  if (req.session.user) {
    next()
  }
  else {
    res.sendStatus(403);
  }
})

app.use('/user', routerUser)
app.use('/venue', routerVenue)



app.listen(process.env.PORT || 3000);
