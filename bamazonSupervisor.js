const questioner = require('inquirer');
const chalk = require('chalk');
const mysql = require("mysql");
const cTable = require('console.table');

const connection = require('./db_connection.js');
const department = require('./department.js');

var values = [[
//    Product Table Column Names
    chalk.green.bold('Product ID'), 
    chalk.green.bold('Product name'), 
    chalk.green.bold('Department'), 
    chalk.green.bold('Price'), 
    chalk.green.bold('Stock (in units)'),
    chalk.green.bold('Product Sales'),]];

var questions = [
  {
    name: "menuS",
    type: "list",
    message: chalk.green("SELECT ANY OPTION FROM THE MENU BELOW:\n"),
    choices: ['View Product Sales by Department','Create New Department']
  },
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

function showDepartmentSales(){
//    anotherJoin to show form departments and products
};

function addDepartment(){
//    use the departmet.js constructor and inquirer to get the values
    questioner.prompt(newDepa).then(answer => {
        var newDepa = new department(answer.name,answer.overHcost);
        writeNewInDB(8,newDepa.name,newDepa.overHcost);
    });
};

function writeNewInDB(id,departments,ohc){
    connection.query("INSERT INTO products SET ?",
    { 
      department_id:id,    
      department_name: departments,        
      over_head_costs: ohc,
    },
    function(err, res) {
      console.log('Department '+chalk.green.bold(departments)+' Added Successfully');
      supervisorMenu();    
    })
}
