
-- Disable foreign key checks for initial setup
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Salaries;
DROP TABLE IF EXISTS Jobs;
DROP TABLE IF EXISTS Employees_to_Jobs;

CREATE TABLE Departments(
    dep_id  int AUTO_INCREMENT NOT NULL UNIQUE,
    dep_name varchar(64) NOT NULL,
    dep_num_employees int NOT NULL,
    PRIMARY KEY (dep_id)
);

CREATE TABLE Employees(
    emp_id int AUTO_INCREMENT NOT NULL UNIQUE,
    emp_name varchar(99) NOT NULL, 
    dep_id int NOT NULL,
    hire_date date NOT NULL,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (dep_id) REFERENCES Departments(dep_id) ON DELETE CASCADE
);

CREATE TABLE Salaries(
    salary_id int AUTO_INCREMENT NOT NULL UNIQUE,
    job_id int NOT NULL,
    annual_pay int NOT NULL,
    bonus int NOT NULL,
    PRIMARY KEY (salary_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
);

CREATE TABLE Jobs(
    job_id int AUTO_INCREMENT NOT NULL UNIQUE,
    job_title varchar(99) NOT NULL,
    dep_id int NOT NULL,
    PRIMARY KEY (job_id),
    FOREIGN KEY (dep_id) REFERENCES Departments(dep_id) ON DELETE CASCADE
);

CREATE TABLE Employees_to_Jobs(
    emp_to_job_id int AUTO_INCREMENT NOT NULL UNIQUE,
    emp_id int NOT NULL,
    job_id int NOT NULL,
    PRIMARY KEY (emp_to_job_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (emp_id) REFERENCES Employees(emp_id) ON DELETE CASCADE
);

INSERT INTO Departments (dep_name, dep_num_employees) VALUES 
('Management', 3),
('Front-of-house', 8),
('Back-of-house', 7);

INSERT INTO Jobs (job_title, dep_id) VALUES
('General Manager', (SELECT dep_id FROM Departments WHERE dep_name = 'Management')),
('Assistant Manager', (SELECT dep_id FROM Departments WHERE dep_name = 'Management')),
('Server', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Cashier', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Janitor', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Head Chef', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Sous Chef', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Dishwasher', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house'));


-- Insert employees with dep_id determined by department name
INSERT INTO Employees (emp_name, hire_date, dep_id) VALUES 
('Alice Johnson', '2020-01-15', (SELECT dep_id FROM Departments WHERE dep_name = 'Management')),
('Bob Smith', '2019-06-01', (SELECT dep_id FROM Departments WHERE dep_name = 'Management')),
('Carol White', '2021-04-23', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('David Brown', '2018-10-12', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Eve Davis', '2022-08-05', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Frank Harris', '2020-11-19', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Grace Lee', '2021-07-30', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Hank Wilson', '2019-02-25', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Ivy Martinez', '2023-01-10', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Jack Garcia', '2022-03-17', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Karen Clark', '2020-06-25', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Leo Rodriguez', '2021-09-08', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Mona Walker', '2018-12-14', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Nina Hall', '2019-11-20', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Oscar Lewis', '2022-05-29', (SELECT dep_id FROM Departments WHERE dep_name = 'Back-of-house')),
('Pamela Young', '2023-02-16', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Quinn Allen', '2020-03-04', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house')),
('Ruth King', '2021-11-22', (SELECT dep_id FROM Departments WHERE dep_name = 'Front-of-house'));


-- Insert into employees to jobs table 
INSERT INTO Employees_to_Jobs (emp_id, job_id) VALUES
((SELECT emp_id FROM Employees WHERE emp_name = 'Alice Johnson'), (SELECT job_id FROM Jobs WHERE job_title = 'General Manager')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Bob Smith'), (SELECT job_id FROM Jobs WHERE job_title = 'Assistant Manager')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Carol White'), (SELECT job_id FROM Jobs WHERE job_title = 'Server')),
((SELECT emp_id FROM Employees WHERE emp_name = 'David Brown'), (SELECT job_id FROM Jobs WHERE job_title = 'Server')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Eve Davis'), (SELECT job_id FROM Jobs WHERE job_title = 'Server')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Frank Harris'), (SELECT job_id FROM Jobs WHERE job_title = 'Cashier')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Grace Lee'), (SELECT job_id FROM Jobs WHERE job_title = 'Cashier')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Hank Wilson'), (SELECT job_id FROM Jobs WHERE job_title = 'Janitor')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Ivy Martinez'), (SELECT job_id FROM Jobs WHERE job_title = 'Janitor')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Jack Garcia'), (SELECT job_id FROM Jobs WHERE job_title = 'Head Chef')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Karen Clark'), (SELECT job_id FROM Jobs WHERE job_title = 'Sous Chef')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Leo Rodriguez'), (SELECT job_id FROM Jobs WHERE job_title = 'Sous Chef')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Mona Walker'), (SELECT job_id FROM Jobs WHERE job_title = 'Dishwasher')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Nina Hall'), (SELECT job_id FROM Jobs WHERE job_title = 'Dishwasher')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Oscar Lewis'), (SELECT job_id FROM Jobs WHERE job_title = 'Dishwasher')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Pamela Young'), (SELECT job_id FROM Jobs WHERE job_title = 'Server')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Quinn Allen'), (SELECT job_id FROM Jobs WHERE job_title = 'Server')),
((SELECT emp_id FROM Employees WHERE emp_name = 'Ruth King'), (SELECT job_id FROM Jobs WHERE job_title = 'Server'));

INSERT INTO Salaries (job_id, annual_pay, bonus) VALUES
((SELECT job_id FROM Jobs WHERE job_title = 'General Manager'), 90000, 10000),
((SELECT job_id FROM Jobs WHERE job_title = 'Assistant Manager'), 65000, 5000),
((SELECT job_id FROM Jobs WHERE job_title = 'Server'), 35000, 2000),
((SELECT job_id FROM Jobs WHERE job_title = 'Cashier'), 30000, 1500),
((SELECT job_id FROM Jobs WHERE job_title = 'Janitor'), 28000, 1000),
((SELECT job_id FROM Jobs WHERE job_title = 'Head Chef'), 70000, 7000),
((SELECT job_id FROM Jobs WHERE job_title = 'Sous Chef'), 50000, 3000),
((SELECT job_id FROM Jobs WHERE job_title = 'Dishwasher'), 25000, 500);

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
COMMIT;