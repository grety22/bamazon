//    other dependencies
const questioner = require('inquirer');
const chalk = require('chalk');
const mysql = require("mysql");
const cTable = require('console.table');

const connection = require('./db_connection.js');

var joinDBs = 'SELECT products.item_id, products.product_name, products.department_id, products.price, products.stock_quantity, products.product_sales, department.department_id, department.department_name FROM (products INNER JOIN department ON products.department_id = department.department_id)';
//    values will contain the product table
var values = [[
//    Product Table Column Names
    chalk.green.bold('Product ID'), 
    chalk.green.bold('Product name'), 
    chalk.green.bold('Department'), 
    chalk.green.bold('Price'), 
    chalk.green.bold('Stock (in units)'),
    chalk.green.bold('Product Sales')]];
var selectID = [];
var arrayIDname = [];
var selectedProduct = '';

//    Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
//    Run the start function after the connection is made to prompt the user
  showProductList();
});
//    Reading All product info from Database
var showProductList = function(){
    connection.query(joinDBs, 
    function(err, results) {
        if (err) throw err;
        
        console.log(chalk.cyan.bold('****************** WELCOME TO ')+chalk.magenta.bold('BAMAZON ')+chalk.cyan.bold('******************'));
        
        console.log();
        
        console.log(chalk.yellow.bold('Today we have the following especial Products : '));
           
        readAllFromDB(results); 
    });
}
//////////////////////////////////////////////////////////////////////////////
function readAllFromDB(r){
        for (var i = 0; i<r.length; i++){
//          TO SHOW THE ROW RED WHEN THE QUANTITY IS LESS OR EQUAL THAN ONE
            if (r[i].stock_quantity == 0){
                arrayIDname[0] = chalk.red(r[i].item_id); 
                arrayIDname[1] = chalk.red(r[i].product_name); 
                arrayIDname[2] = chalk.red(r[i].department_name);
                arrayIDname[3] = chalk.red('$ '+r[i].price);
                arrayIDname[4] = chalk.red(r[i].stock_quantity);    
                arrayIDname[5] = chalk.red(r[i].product_sales);    
            } else {
                arrayIDname[0] = r[i].item_id; 
                arrayIDname[1] = r[i].product_name; 
                arrayIDname[2] = r[i].department_name;
                arrayIDname[3] = '$ '+r[i].price;
                arrayIDname[4] = r[i].stock_quantity;
                arrayIDname[5] = r[i].product_sales;
            }
            selectID.push(arrayIDname[0].toString());
            values.push(arrayIDname);
            arrayIDname = [];
        }
        
        console.table(values[0], values.slice(1));
//      ask the customer if they want to buy
        askWantToBuy();
}

var questions = [
  {
    name: "wantToBuy",
    type: "confirm",
    message: "Would you like to buy something?",
    default: true
  },
  {
    name: "productID",
    type: "list",
    message: "Especified the product id of the item: ",
    choices: selectID
  },
  {
    name: "howMany",
    type: "input",
    message: "how many units of the product you would like to buy?"
  }    
];
//////////////////////////////////////////////////////////////////////////////
function askWantToBuy() {
    questioner.prompt(questions[0]).then(answer => {
        if (answer.wantToBuy) {
//            IF YES
            askProductID();
        } else {
            console.log('OK see you next time, have a good day');
            process.exit();
        }
  });
}
//////////////////////////////////////////////////////////////////////////////
function askProductID(){
    questioner.prompt(questions[1]).then(answer => {
        selectedProduct = answer.productID;
        askHowMany();
    });
}
//////////////////////////////////////////////////////////////////////////////
function askHowMany(){
    questioner.prompt(questions[2]).then(answer => {
         typedQuantity = answer.howMany;
         checkInventory(typedQuantity,values[selectedProduct][4]);    
    });
}
//////////////////////////////////////////////////////////////////////////////
function checkInventory(a,b){
    if (a>b){
        console.log();
        console.log(chalk.red('              Insufficient quantity!\n')+('You can choose a quantity between 0 and ')+chalk.green(b)+(' for this product'));
        console.log();
        askHowMany();
    } else {
        console.log('Processing Order ...');
        console.log();
        processOrder(a,b);
    }
}
//////////////////////////////////////////////////////////////////////////////
function processOrder(userQuant,AvalQuant){
    writeToDB(AvalQuant-userQuant);
    showTotalCost(userQuant);
    
};
//////////////////////////////////////////////////////////////////////////////
//updating stock 
function writeToDB(newValue){
    var sqlWrite = 'UPDATE products SET ? WHERE ?';
    connection.query(sqlWrite, 
    [
      {
        stock_quantity: newValue
      },
      {
        item_id: selectedProduct
      }
    ],
                 
    function(err, results) {
        if (err) throw err;
        console.log('Order Processed '+ chalk.blue('Successfully'));
//        SET DEFAULTS
        values = [[
            chalk.green.bold('Product ID'), 
            chalk.green.bold('Product name'), 
            chalk.green.bold('Department'), 
            chalk.green.bold('Price'), 
            chalk.green.bold('Stock (in units)'),
            chalk.green.bold('Product Sales')]];
        console.log();
        
    });
}
//////////////////////////////////////////////////////////////////////////////
function showTotalCost(qSelected){
    var sqlRead = 'SELECT * FROM products';
    connection.query(sqlRead, 
    function(err, results) {
        if (err) throw err;
//        the price for the product into db
        var price = results[selectedProduct-1].price;
        console.log('You have paid '+chalk.yellow.bold('$')+chalk.yellow.bold(price*qSelected)+' for '+qSelected+' '+results[selectedProduct-1].product_name);
        console.log();
        updateProductSales(results[selectedProduct-1].product_sales+price*qSelected);
        
    });
}
//////////////////////////////////////////////////////////////////////////////
function updateProductSales(newValue){
 var sqlWrite = 'UPDATE products SET ? WHERE ?';
    connection.query(sqlWrite, 
    [
      {
        product_sales: newValue
      },
      {
        item_id: selectedProduct
      }
    ],
                 
    function(err, results) {
        if (err) throw err;
        
        console.log();
        showProductList();
    });    
}

