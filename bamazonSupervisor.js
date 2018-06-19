const questioner = require('inquirer');
const chalk = require('chalk');
const mysql = require("mysql");
const cTable = require('console.table');

const connection = require('./db_connection.js');
const department = require('./department.js');

var productSales = [];
var arrayIDname = [];
var values = [[
//  Product Table Column Names
    chalk.green.bold('Department ID'), 
    chalk.green.bold('Department name'), 
    chalk.green.bold('Over head costs'), 
    chalk.green.bold('Product Sales'), 
    chalk.green.bold('Total Profit')
]];

var questions = [
  {
    name: "menuS",
    type: "list",
    message: chalk.green("SELECT ANY OPTION FROM THE MENU BELOW:"),
    choices: ['View Product Sales by Department','Create New Department']
  }
];

var newDepa = [
    {
    name: "name",
    type: "message",
    message: chalk.yellow("TYPE THE NEW DEPARTMENT NAME: \n"),
    },
    {
    name: "overHcost",
    type: "message",
    message: chalk.yellow("TYPE THE Over Head Cost: \n"),
    },
]

//    Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
//    Run the start function after the connection is made to prompt the user
  start();
});
///////////////////////////////////////////////////////////////////

function start(){
    console.log();
    console.log(chalk.red.bold('***************   BAMAZON SUPERVISOR DASHBOARD   ***************'));
    console.log();
    supervisorMenu();
    console.log();
    calculateSales();
    
}
///////////////////////////////////////////////////////////////////
function supervisorMenu(){
     questioner.prompt(questions[0]).then(answer => {
        if (answer.menuS === 'View Product Sales by Department'){
            console.log(chalk.green.bold('****************** PRODUCTS SALES BY DEPARTMENT IN ')+chalk.magenta.bold('BAMAZON ')+chalk.green.bold('******************'));
            showDepartmentSales();
        }   
        if (answer.menuS === 'Create New Department'){
            console.log('... Loading -> Create a New Department');
            addDepartment();
        } 
        
    });
}

var sqlr = 'SELECT department.department_id, department.department_name, department.over_head_costs, products.product_sales FROM department,products GROUP BY department.department_name ORDER BY department.department_id';

function showDepartmentSales(){
//  anotherJoin to show form departments and products
    connection.query(sqlr, 
    function(err, results) {
        if (err) throw err;
        readAllFromDB(results); 
    });
}; 

function addDepartment(){
//  use the departmet.js constructor and inquirer to get the values
    questioner.prompt(newDepa).then(answer => {
        var newDepa = new department(answer.name,answer.overHcost);
        writeNewInDB(newDepa.name,newDepa.overHcost);
    });
};

function writeNewInDB(id,departments,ohc){
    connection.query("INSERT INTO department SET ?",
    { 
        department_id: id,    
      department_name: departments,        
      over_head_costs: ohc,
    },
    function(err, res) {
      if (err) throw err;    
      console.log('Department '+chalk.green.bold(departments)+' Added Successfully');
      console.log();
//    showDepartmentSales();
      supervisorMenu();    
    })
}

function readAllFromDB(r){
        for (var i = 0; i<r.length; i++){
//              TO SHOW THE ROW RED WHEN THE QUANTITY IS LESS OR EQUAL THAN ONE
                arrayIDname[0] = r[i].department_id; 
                arrayIDname[1] = r[i].department_name; 
                arrayIDname[2] = r[i].over_head_costs;
                arrayIDname[3] = productSales[i];
                arrayIDname[4] = productSales[i]-arrayIDname[2];
            
                values.push(arrayIDname);
                arrayIDname = [];
        }
        console.log();
        console.table(values[0], values.slice(1));
        supervisorMenu();
}

var sqlp = 'SELECT products.department_id, SUM (products.product_sales) AS total_sales FROM products GROUP BY products.department_id';

function calculateSales(){
//    anotherJoin to show form departments and products
    connection.query(sqlp, 
    function(err, results) {
        if (err) throw err;
        
        for (var i = 0; i<results.length; i++){
//          TO SHOW THE ROW RED WHEN THE QUANTITY IS LESS OR EQUAL THAN ONE
            productSales.push(results[i].total_sales);
        }
    });
};
