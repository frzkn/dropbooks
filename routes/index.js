// refactor this spaghetti
// separate cookies
// console.log(loginEmail+loginPassword);
// separate nodemailer
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var connection = require('./../database/database-module.js').connection;


router.get('/', function(req, res, next) {
  if (!(req.userSession && req.userSession.userId))
    return res.render('index', { loginStatus: false, viewName: "home"});

  else
    loginStatus = true;
  return res.render('index', { loginStatus: true, viewName: "home"});
});


router.get('/login', function(req, res, next) {

  if (!(req.userSession && req.userSession.userId))
    return res.render('login', { loginStatus: false, viewName: ""});
  else {
    loginStatus = true;
    return res.render('login', { loginStatus: true, viewName: ""});
  }

});


router.post('/login', function(req, res) {
  let loginEmail = req.body.email;
  let loginPassword = req.body.password;
  connection.query(`select * from users where email="${req.body.email}"` , (err, results, fields) => {
    if (err) {
      console.log("mysql error:" + err);
    }

    if (results[0].email != loginEmail || results[0].password != loginPassword) {
      return res.render('login', {loginStatus: false, viewName: ""});
    }
    else {
      req.userSession.userId = results[0].id;
      console.log(req.userSession);
      return res.redirect('/send'); }
  });
});


router.get('/register', function(req, res, next) {
  if (!(req.userSession && req.userSession.userId))
    return res.render('register', { loginStatus: false, viewName: ""});

  else
    loginStatus = true;
  return res.render('register', { loginStatus: true, viewName: ""});
});


router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  connection.query(`select * from users where email="${req.body.email}"` , (err, results, fields) => {
    if (err) {
      console.log("mysql error:"+err);
    }

    if (results.length==0) {
      connection.query(`insert into users (email, kindle_email, password ,firstname) values ("${req.body.email}","${req.body.kindleemail}","${req.body.password}","${req.body.username}");`);
      return res.redirect('/');
    }

  });

});

router.get('/logout', function(req, res, next) {
  req.userSession.reset();
  res.redirect('/');

});


router.post('/account', (req, res, next) => {


  connection.query(`select * from users where id="${req.userSession.userId}"` , (err, results, fields) => {
    if(req.body.kindle_email == results[0].kindle_email){
      console.log('why so stupid');
      return res.redirect('/account');
    }
    else {
      connection.query(`update users set kindle_email="${req.body.kindle_email}" where id="${req.userSession}" `);
      return res.redirect('/account');
    }

  });
});


router.get('/send', function(req, res, next) {
  // Check if session is unavailable
  if (!(req.userSession && req.userSession.userId)) {
    return res.redirect('/login');
  }
  console.log('HERE IS THE USER ID '+ req.userSession.userId);
  connection.query(`select id from users where id="${req.userSession.userId}"` , (err, results, fields) => {
    if (err) {
      return next(err);
    }

    if (!results[0].id) {
      return res.redirect('/login');
    }

    res.render('send', { loginStatus: true, viewName: 'send'} );

  });
});

router.post('/send', function(req, res, next){
  console.log("Files lies below!!!");
  console.log(req.files.book);

  var toEmail;

  connection.query(`select * from users where id="${req.userSession.userId}"` , (err, results, fields) => {
    if (err) {
      console.log("mysql error:" + err);
    }
    console.log("Here are the results");
    console.log(results);
    toEmail = results[0].kindle_email;
    console.log('inside the call back'+ toEmail);
    console.log('sending email to ' + toEmail);

    // TODO implement convert feature for PDFs

    // nodemailer
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dropbookskindle@gmail.com',
        pass: ''
      }
    });
    // get user's kindle email address here
    const mailOptions = {
      from: 'sender@email.com',
      to: toEmail,
      subject: req.files.book.name,
      html: `<h2> Hello this is a drop from dropbooks ! <h2> <br> <p> Regards.</p>`,
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

    });

  });
  return res.redirect('/');
});

router.get('/team', function(req, res, next) {
  res.render('team',{ viewName: "", loginStatus: false });
})

router.get('/account', function(req, res, next) {


  if(!(req.userSession.userId && req.userSession)) {
    return res.redirect('/login');
  }

  else {

    connection.query(`select * from users where id="${req.userSession.userId}"` , (err, results, fields) => {
      if (err) {
        return next(err);
      }

      if (!results[0].id) {
        return res.redirect('/login');
      }
      console.log(results);

      return res.render('account', {
        loginStatus: true,
        viewName: 'account',
        firstname: results[0].firstname,
        email: results[0].email,
        kindle_email: results[0].kindle_email
      } );

    });
  }
});



module.exports = router;



