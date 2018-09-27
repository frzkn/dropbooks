const mysql  = require('mysql');

var connection = mysql.createConnection({
  hostname: 'localhost',
  user: 'root',
  password: '',
  database: 'bookdrop'
});

module.exports.connection = connection;

