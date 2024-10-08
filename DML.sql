-- Used general format from the Project page and bsg_sample_data_manipulation_queries.sql to create these queries 
-- Also used https://www.geeksforgeeks.org/sql-server-crud-operations/ as a resource to learn each operation

-- SELECT statements ==================================================
-- Select all departments
SELECT * FROM Departments;
--Select all deppartment names for drop down 
SELECT dep_name, dep_id from Departments;

-- Select all employees
SELECT * FROM Employees;
SELECT emp_id, emp_name, DATE_FORMAT(hire_date, '%m/%d/%Y') AS hire_date FROM Employees;
SELECT emp_id, emp_name, DATE_FORMAT(hire_date, '%m/%d/%Y') AS hire_date FROM Employees WHERE emp_name LIKE "${req.query.name}%;"
-- Get all job IDs and job titles for a specific employee by their name
SELECT ej.job_id, j.job_title
FROM Employees e
INNER JOIN Employees_to_Jobs ej ON e.emp_id = ej.emp_id
INNER JOIN Jobs j ON ej.job_id = j.job_id
WHERE e.emp_name = :inputEmployeeName;

-- Select all jobs
SELECT * FROM Jobs;

-- Select all employee-job relationships
SELECT * FROM Employees_to_Jobs;

-- Select all salaries
SELECT * FROM Salaries;

-- INSERT  statements ==================================================
-- Query to add a new department
INSERT INTO Departments (dep_name, dep_num_employees)
VALUES (:depNameInput, :depNumEmployeesInput);

-- Query to add a new job
INSERT INTO Jobs (job_title, dep_id)
VALUES (:jobTitleInput, (SELECT dep_id FROM Departments WHERE dep_name = :depNameInput));

-- Query to add a new employee
INSERT INTO Employees (emp_name, hire_date)
VALUES (:empNameInput, :hireDateInput);

-- Query to assign a job to an employee
INSERT INTO Employees_to_Jobs (emp_id, job_id)
VALUES (
    (SELECT emp_id FROM Employees WHERE emp_name = :empNameInput),
    (SELECT job_id FROM Jobs WHERE job_title = :jobTitleInput)
);

-- Query to set a salary for a job
INSERT INTO Salaries (job_id, annual_pay, bonus)
VALUES (
    (SELECT job_id FROM Jobs WHERE job_title = :jobTitleInput),
    :annualPayInput,
    :bonusInput
);


-- UPDATE statements ==================================================
-- Update department name
UPDATE Departments
SET dep_name = :newDepNameInput
WHERE dep_name = :currentDepNameInput;

-- Update employee information
UPDATE Employees
SET emp_name = :newEmpNameInput, hire_date = :newHireDateInput, dep_id = (SELECT dep_id FROM Departments WHERE dep_name = :newDepNameInput)
WHERE emp_name = :currentEmpNameInput;

-- Update job title
UPDATE Jobs
SET job_title = :newJobTitleInput
WHERE job_title = :currentJobTitleInput;

-- Update employee-job relationship
UPDATE Employees_to_Jobs
SET job_id = :newJobIDInput, emp_id = :empNameInput
WHERE emp_to_job_id = (:currentEmpToJobInput);

-- Update salary details
UPDATE Salaries
SET job_id = :newJobId, annual_pay = :newAnnualPayInput, bonus = :newBonusInput
WHERE salary_id = :currentSalaryId;

-- DELETE statements ==================================================
-- Delete a department by name
DELETE FROM Departments WHERE dep_name = :depNameInput;

-- Delete an employee by name
DELETE FROM Employees WHERE emp_name = :empNameInput;

-- Delete a job by title
DELETE FROM Jobs WHERE job_title = :jobTitleInput;

-- Delete an employee-job relationship by employee and job
DELETE FROM Employees_to_Jobs 
WHERE emp_id = (SELECT emp_id FROM Employees WHERE emp_name = :empNameInput)
AND job_id = (SELECT job_id FROM Jobs WHERE job_title = :jobTitleInput);

-- Delete a salary entry by job title
DELETE FROM Salaries 
WHERE job_id = (SELECT job_id FROM Jobs WHERE job_title = :jobTitleInput);