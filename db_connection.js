var mysql = require("mysql");

// create the connection information for the sql database

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

module.exports = connection;