const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

/* GET home page. */
router.get('(/|login|register|account)', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('*', function(req, res){
  res.redirect('/');
});

const ctrlAuth = require('../controllers/auth');

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;