var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var nodemailer = require('nodemailer');
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
  console.log('get request to /send');
  res.render('send');
});

router.post('/send', function(req, res, next){
  console.log("Files lies below!!!");
  console.log(req.files.book);

  // nodemailer
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dropbookskindle@gmail.com',
      // Doesnt work
      pass: 'DROPbooks1'
    }
  });
  // get user's kindle email address here
  const mailOptions = {
    from: 'sender@email.com',
    to: 'farazrk001@gmail.com',
    subject: req.files.book.name,
    html: '<p> I dont know purpose of this </p>',
    attachments: [
      {
        filename: req.files.book.name,
        content: new Buffer(req.files.book.data)
      }
    ]
  };

  transporter.sendMail(mailOptions, function (err, info){
    if(err)
      throw err;
    else
      console.log(info);

  })



  res.render('send');
});



module.exports = router;
