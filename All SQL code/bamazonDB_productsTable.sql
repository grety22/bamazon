/*SCHEMA = DATABASE*/
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO  products  ( item_id ,  product_name ,  department_name,  price ,  stock_quantity ) 
VALUES (1, 'ipod shuffle', 'electronic', 40.5, 22);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (2, 'coffe', 'food', 2.70, 1000);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (3, 'wood meter', '50', 100, 305);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (4, 'car', 'automotive', '10000', 2);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (5, 'ASUS PC Corei7 16GB 2TB SSD', 'computers', '1500', '5');
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (6, 'Mac Pro', 'computers', '3000', 1);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (7, '4 package Ligth', 'home', '20', 755);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (8, 'High Hells Red', 'Shoes', '15.99', 420);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (9, 'Blue flowered dress', 'Clothes', '182', 712);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (10, 'camera', 'electronic', '600', 10);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (11, 'pen', 'office', '1', 480);
INSERT INTO  products  ( item_id ,  product_name ,  department_name ,  price ,  stock_quantity ) VALUES (12, 'Water', 'food', '2', 940);
