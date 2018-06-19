const questioner = require('inquirer');
const chalk = require('chalk');
const mysql = require("mysql");
const cTable = require('console.table');

const connection = require('./db_connection.js');
const product = require('./product.js');

var values = [[
//    Product Table Column Names
    chalk.green.bold('Product ID'), 
    chalk.green.bold('Product name'), 
    chalk.green.bold('Department'), 
    chalk.green.bold('Price'), 
    chalk.green.bold('Stock (in units)'),
    chalk.green.bold('Product Sales')]];

var howMany = 0;
var selectID = [];
var selectDepa = [];
var arrayIDname = [];
var selectedProduct = '';
var selectedQuantity = 0;

var questions = [
  {
    name: "menu",
    type: "list",
    message: chalk.cyan("SELECT ANY OPTION FROM THE MENU BELOW:\n"),
    choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product']
  },
  {
    name: "addToInv",
    type: "list",
    message: chalk.cyan("SELECT A PRODUCT TO ADD INVENTORY\n"),
    choices: selectID
  },  
  {
    name: "restock",
    type: "confirm",
    message: chalk.cyan("DO YOU WANT TO ADD MORE OF THIS PRODUCT?\n"),
  }, 
  {
    name: "howManyToAdd",
    type: "message",
    message: chalk.cyan("TYPE THE QUANTITY TO ADD: \n"),
  },
  {
    name: "newProduct",
    type: "message",
    message: chalk.cyan("TYPE THE QUANTITY TO ADD: \n"),
  }     
];

var newProductQ = [
    {
    name: "name",
    type: "message",
    message: chalk.yellow("TYPE THE PRODUCT NAME TO ADD: \n"),
    },
    {
    name: "department",
    type: "list",
    message: chalk.yellow("TYPE THE DEPARTMENT OF THIS PRODUCT: \n"),
    choices: selectDepa    
    },
    {
    name: "price",
    type: "message",
    message: chalk.yellow("TYPE THE PRICE OF THIS PRODUCT: \n"),
    default: 0
    }, 
    {
    name: "stock",
    type: "message",
    message: chalk.yellow("TYPE THE STOCK OF THIS PRODUCT: \n"),
    default: 0
    } 
]

//    Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
//    Run the start function after the connection is made to prompt the user
  readFromDB();   
  readDepartments(); 
  start();
});
///////////////////////////////////////////////////////////////////

function start(){
    console.log();
    console.log(chalk.green.bold('***************   BAMAZON MANAGER DASHBOARD   ***************'));
    console.log();
    managerMenu();
}
///////////////////////////////////////////////////////////////////

function managerMenu() {
    
//    Set all vars to default before to start
    values = [[
        chalk.green.bold('Product ID'), 
        chalk.green.bold('Product name'), 
        chalk.green.bold('Department'), 
        chalk.green.bold('Price'), 
        chalk.green.bold('Stock (in units)'),
        chalk.green.bold('Product Sales'),
    ]];

    howMany = 0;
    selectedProduct = '';
    selectedQuantity = 0;
    
    var joinDBs = 'SELECT products.item_id, products.product_name, products.department_id, products.price, products.stock_quantity, products.product_sales, department.department_id, department.department_name FROM (products INNER JOIN department ON products.department_id = department.department_id)';
    
    var joinDB5 = 'SELECT products.item_id, products.product_name, products.department_id, products.price, products.stock_quantity, products.product_sales, department.department_id, department.department_name FROM (products INNER JOIN department ON products.department_id = department.department_id) WHERE products.stock_quantity<=5';
    
    questioner.prompt(questions[0]).then(answer => {
        if (answer.menu === 'View Products for Sale'){
            console.log('... Loading -> View Products for Sale');  
            viewProducts(joinDBs, chalk.cyan.bold('****************** PRODUCTS FOR SALE IN  ')+chalk.magenta.bold('BAMAZON ')+chalk.cyan.bold('******************'));
        }   
        if (answer.menu === 'View Low Inventory'){
            console.log('... Loading -> View Low Inventory');  
            viewProducts(joinDB5, chalk.cyan.bold('*** PRODUCTS WITH AN INVENTORY COUNT LOWER THAN 5 IN ')+chalk.magenta.bold('BAMAZON ')+chalk.cyan.bold(' ***'));
        } 
        if (answer.menu === 'Add to Inventory'){
            console.log('... Loading -> Add to Inventory');  
            addToInventory();
        } 
        if (answer.menu === 'Add New Product'){
            console.log('... Loading -> Add New Product');  
            addNewProduct();
        } 
    });
}
///////////////////////////////////////////////////////////////////
function viewProducts(sql,msg){
    connection.query(sql, function(err, results) {
        if (err) throw err;
        console.log();
        
        console.log(msg);
        
        console.log();
        
        readAllFromDB(results); 
    });
}
///////////////////////////////////////////////////////////////////
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
            
            values.push(arrayIDname);
            arrayIDname = [];
        }
        
        console.table(values[0], values.slice(1));
        managerMenu();
}
///////////////////////////////////////////////////////////////////
function addToInventory(){
     questioner.prompt(questions[1]).then(answer => {
        selectedProduct = answer.addToInv;
        wantToAdd();
     });
};
///////////////////////////////////////////////////////////////////
function readFromDB(){
    var sql = 'SELECT product_name FROM products';
    connection.query(sql, function(err, results) {
        if (err) throw err;
        
        for (var i = 0; i<results.length; i++){
            selectID.push(results[i].product_name);
        }
    });
};
///////////////////////////////////////////////////////////////////
function readDepartments(){
    var sql = 'SELECT department_name FROM department';
    connection.query(sql, function(err, results) {
        if (err) throw err;
        
        for (var i = 0; i<results.length; i++){
            selectDepa.push(results[i].department_name);
        }
    });
};
///////////////////////////////////////////////////////////////////
function wantToAdd(){
    questioner.prompt(questions[2]).then(answer => {
        if (answer.restock){
            howManyToAdd();     
        } else {
            addToInventory();        
        }
    });
}
///////////////////////////////////////////////////////////////////
function howManyToAdd(){
    currentQ();
    questioner.prompt(questions[3]).then(answer => {
        howMany = answer.howManyToAdd;
        updateDB(howMany,selectedQuantity);
    });
}
///////////////////////////////////////////////////////////////////
function currentQ(){
        var sql = 'SELECT stock_quantity FROM products WHERE product_name='+"'"+selectedProduct+"'";
        connection.query(sql, function(err, results) {
            if (err) throw err;
            selectedQuantity = results[0].stock_quantity;
        });
}
///////////////////////////////////////////////////////////////////
function updateDB(newValue,b){
    newValues =  parseInt(newValue);
    
    var sqlWrite = 'UPDATE products SET ? WHERE ?';
    connection.query(sqlWrite, 
    [
      {
        stock_quantity: newValues+b
      },
      {
        product_name: selectedProduct
      }
    ],
                 
    function(err, results) {
        if (err) throw err;
        console.log('Product added '+ chalk.blue('Successfully'));
//        SET DEFAULTS
        values = [[
            chalk.green.bold('Product ID'), 
            chalk.green.bold('Product name'), 
            chalk.green.bold('Department'), 
            chalk.green.bold('Price'), 
            chalk.green.bold('Stock (in units)'),
            chalk.green.bold('Product Sales')]];
        
        console.log();
        managerMenu();
    });
}
///////////////////////////////////////////////////////////////////
function addNewProduct(){
    questioner.prompt(newProductQ).then(answer => {
       var newProduct = new product(answer.name,answer.department,answer.price,answer.stock);
       createDBitem(selectID.length+1,newProduct.name,newProduct.department,newProduct.price,newProduct.stock);
    
       console.log(newProduct.name);
    });
};
///////////////////////////////////////////////////////////////////
function createDBitem(id,product,department,price,stock){
    
    var sqlInsert = 'INSERT INTO products SET ?';
    var newOne = {
        item_id: id,
        product_name: product,
        department_id: (selectDepa.indexOf(department))+1,
        price: price,
        stock_quantity: stock
    }
    
    connection.query(sqlInsert, newOne,
                     
    function(err, res) {
       if (err) throw err;    
       console.log('Product '+chalk.green.bold(product)+' Added Successfully');
       managerMenu(); 
        
    })
}