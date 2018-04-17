USE bamazon;

CREATE TABLE department(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL default 0,
  PRIMARY KEY (department_id)
);

INSERT INTO  department  ( department_id ,  department_name ,  over_head_costs) 
VALUES (1, 'electronic', 2),(2, 'food', 8),(3, 'home', 10),(4, 'automotive', 5),(5, 'computers', 1),(6, 'shoes', 7),(6, 'clothes', 11),(7, 'office', 1);
