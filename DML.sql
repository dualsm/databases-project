-- Used general format from the Project page and bsg_sample_data_manipulation_queries.sql to create these queries 
-- Also used https://www.geeksforgeeks.org/sql-server-crud-operations/ as a resource to learn each operation

-- SELECT statements ==================================================
-- Select all departments
SELECT * FROM Departments;

-- Select all employees
SELECT * FROM Employees;

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
INSERT INTO Employees (emp_name, hire_date, dep_id)
VALUES (:empNameInput, :hireDateInput, (SELECT dep_id FROM Departments WHERE dep_name = :depNameInput));

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
SET job_id = (SELECT job_id FROM Jobs WHERE job_title = :newJobTitleInput)
WHERE emp_id = (SELECT emp_id FROM Employees WHERE emp_name = :empNameInput)
AND job_id = (SELECT job_id FROM Jobs WHERE job_title = :currentJobTitleInput);

-- Update salary details
UPDATE Salaries
SET annual_pay = :newAnnualPayInput, bonus = :newBonusInput
WHERE job_id = (SELECT job_id FROM Jobs WHERE job_title = :jobTitleInput);

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