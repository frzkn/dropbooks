var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = require('./../database/database-module.js').connection;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/login', function(req, res, next) {
  console.log(req.body);
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  var email = req.body.email;
  connection.query(`select * from users where email="${req.body.email}"` , (err, results, fields) => {
    if (err) {
      throw err;
    }
    console.log(results);
    if (results.length==0) {
      connection.query(`insert into users (email, kindle_email, password ) values ("${req.body.email}","${req.body.kindleemail}","${req.body.password}");`);
    }
  });
  console.log(req.body);
  res.redirect('/');

});

router.get('/login', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/logout', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/send', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
