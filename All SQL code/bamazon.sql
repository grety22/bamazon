-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 17, 2018 at 09:29 PM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bamazon`
--

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
CREATE TABLE IF NOT EXISTS `department` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) CHARACTER SET latin1 NOT NULL,
  `over_head_costs` decimal(10,0) DEFAULT '0',
  `total_profit` decimal(10,0) DEFAULT '0',
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_id`, `department_name`, `over_head_costs`, `total_profit`) VALUES
(1, 'electronic', '2', '0'),
(2, 'food', '8', '0'),
(3, 'home', '10', '0'),
(4, 'automotive', '5', '0'),
(5, 'computers', '1', '0'),
(6, 'shoes', '7', '0'),
(7, 'office', '1', '0'),
(8, 'Jewelry', '45', '0');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `department_id` int(11) NOT NULL,
  `price` decimal(10,0) DEFAULT '0',
  `stock_quantity` int(11) DEFAULT '0',
  `product_sales` decimal(10,0) DEFAULT '0',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`item_id`, `product_name`, `department_id`, `price`, `stock_quantity`, `product_sales`) VALUES
(1, 'ipod shuffle', 1, '41', 2, '0'),
(2, 'coffe', 2, '3', 5368, '261'),
(3, 'wood meter', 3, '100', 6, '0'),
(4, 'car', 4, '10000', 1, '0'),
(5, 'ASUS PC Corei7 16GB 2TB SSD', 5, '1500', 4, '0'),
(6, 'Mac Pro', 5, '3000', 1, '0'),
(7, '4 package Ligth', 3, '20', 750, '0'),
(8, 'High Hells Red', 6, '16', 12, '0'),
(9, 'Blue flowered dress', 5, '182', 712, '0'),
(10, 'camera', 1, '600', 1, '1200'),
(11, 'pen', 7, '1', 480, '0'),
(12, 'Water', 2, '2', 944, '0'),
(13, 'Coca Cola', 1, '8', 89, '0'),
(14, 'GLASS', 4, '87', 54, '0');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
