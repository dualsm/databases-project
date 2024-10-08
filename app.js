// URL: https://github.com/osu-cs340-ecampus
// Date Retrieved: 7/31/2024
// Title: CS340 Node-js Starter App
// Type: Tutorial Github Repo
// Authors: gkochera, cortona1, currym-osu, dmgs11

// Setup
// setting up port to use, express instance created
var express = require('express');
var app = express();
let PORT = 44082;

// step 5 from github: 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const path = require('path')

app.use(express.static('public')) // so it can use the public directory to put CSS TO WEBPAGE
// needed this source: https://expressjs.com/en/starter/static-files.html

// database
var db = require('./database/db-connector')

// setup handlebars engine
const { engine } = require('express-handlebars'); // const engine will create the engine
var exphbs = require('express-handlebars'); // imports handlebars
app.engine('.hbs', engine({extname: ".hbs"})); // create engine to recognize .hbs
app.set('view engine', '.hbs'); // use handlebars engine when encounters the .hbs extension


// Stack overflow reference for non-empty null returns: https://stackoverflow.com/questions/39766555/how-to-check-for-empty-string-null-or-white-spaces-in-handlebar 
const Handlebars = require('handlebars');
Handlebars.registerHelper('checkNull', function(value) {
    return value === null ? 'N/A' : value;
});

// add each css file name to css_arr if you want the css loaded
var css_arr = ['main', 'employees','departments', 'jobs', 'salaries']
app.use((req, res, next) => {
    res.locals.css = css_arr;
    next();
});


// ROUTES
app.get('/', (req,res) => {
    res.render('index'); // render guarantees engine will render webpage before sending HTML to client
});

// Employees 
app.get('/employees', (req,res) => {
    
    let query1;

    if (req.query.name === undefined){
        query1 = "SELECT emp_id, emp_name, DATE_FORMAT(hire_date, '%m/%d/%Y') AS hire_date FROM Employees;";
    }
    else{
        query1 = `SELECT emp_id, emp_name, DATE_FORMAT(hire_date, '%m/%d/%Y') AS hire_date FROM Employees WHERE emp_name LIKE "${req.query.name}%;`
    }
    
    // let query2 = "SELECT * FROM Employees;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('employees', {data:rows});

     })
    
});

app.post('/add-employee-form', function(req,res){
    let data = req.body;

    // check for invalid data entry
    let emp_name = parseInt(data['input_emp_name']);
    if (isNaN(emp_name))
    {
        emp_name = 'NULL'
    }

    // calendar selector already places in YYYY-MM-DD format
    console.log(data['input_hire_date']);
    let query1 = `INSERT INTO Employees (emp_name, hire_date) VALUES ('${data['input_emp_name']}', '${data['input_hire_date']}');`
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/employees');
        }
    })

});

app.delete('/delete-employees-ajax/', function (req,res,next){
    let data = req.body;
    let emp_id = parseInt(data.emp_id);
    let deleteEmployee = `DELETE FROM Employees WHERE emp_id = ?`;

    db.pool.query(deleteEmployee, [emp_id], function(error, rows, fields){
        if(error){
            console.log(error); // log error for troubleshooting
            res.sendStatus(400);
        }

        else{
            db.pool.query(deleteEmployee, [emp_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.put('/put-employee-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)
    let emp_id = parseInt(data.emp_id);

    let queryUpdateEmployee = `UPDATE Employees SET emp_name = '${data.emp_name}', hire_date = '${data.emp_hire_date}' WHERE emp_id = ${emp_id};`;
    let queryRefillTable = "SELECT emp_id, emp_name, DATE_FORMAT(hire_date, '%m/%d/%Y') AS hire_date FROM Employees;";
  
          // Run the 1st query
          db.pool.query(queryUpdateEmployee, [data.emp_name, data.hire_date, emp_id], function(error, rows, fields){
              if (error) {
  
                console.log(error);
                res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(queryRefillTable, [data.emp_name, data.hire_date, emp_id],function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});


// DEPARTMENTS

app.get('/departments', (req,res) => {

    let query1 = `SELECT d.dep_id, d.dep_name, COUNT(ej.emp_id) AS actual_num_employees FROM Departments d LEFT JOIN Jobs j ON d.dep_id = j.dep_id LEFT JOIN Employees_to_Jobs ej ON j.job_id = ej.job_id GROUP BY d.dep_id, d.dep_name, d.dep_num_employees;`;

    db.pool.query(query1, function(error, rows, fields){
        console.log({data:rows});
        res.render('departments', {data:rows});
    });
});

app.post('/add-department-form', function(req,res){
    let data = req.body;

    // check for invalid data entry
    let dep_name = parseInt(data['input_dep_name']);
    if (isNaN(dep_name))
    {
        dep_name = 'NULL'
    }

    // number of employees when adding a department will be 0. That value is incremented when an employee gets assigned a job
    let query1 = `INSERT INTO Departments (dep_name, dep_num_employees) VALUES ('${data['input_dep_name']}', 0);`
    db.pool.query(query1, function(error, rows, fields){

       
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            res.redirect('/departments');
        }
    })
});

// JOBS

app.get('/jobs', (req,res) => {
    let query1 = `SELECT job_id, job_title, Jobs.dep_id, dep_name FROM Jobs JOIN Departments WHERE Jobs.dep_id = Departments.dep_id;`;

    db.pool.query(query1, function(error, rows, fields){
        console.log({data:rows});
        res.render('jobs', {data:rows});
    }); 
});

app.post('/add-job-form', function(req,res){
    let data = req.body;
    console.log(data)

    // check for invalid data entry
    let job_name = parseInt(data['input_job_name']);
    let salary = parseInt(data['input_salary']);
    let bonus = parseInt(data['input_bonus']);
    if (isNaN(job_name))
    {
        job_name = 'NULL'
    }


    // calendar selector already places in YYYY-MM-DD format
    let query1 = `INSERT INTO Jobs (job_title, dep_id) VALUES ('${data['input_job_name']}', ${data['input_dep_id']});`
    let query2 = `INSERT INTO Salaries (job_id, annual_pay, bonus) VALUES ((SELECT job_id FROM Jobs WHERE job_title = '${data['input_job_name']}'), ${salary}, ${bonus});`
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else{
            db.pool.query(query2, function(error, rows, fields){

            
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
                else
                {
                    res.redirect('/jobs');
                }
            })
        }
    })

});

// SALARIES

app.get('/salaries', (req,res) => {
    let query1 = `SELECT salary_id, Salaries.job_id, job_title, annual_pay, bonus FROM Salaries LEFT JOIN Jobs ON Salaries.job_id = Jobs.job_id;`;

    db.pool.query(query1, function(error, rows, fields){
        console.log({data:rows});
        res.render('salaries', {data:rows});
    }); 
});

app.put('/put-salary-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)

    
    let disableFKCheck = `SET FOREIGN_KEY_CHECKS = 0;`
    let enableFKCheck = `SET FOREIGN_KEY_CHECKS = 1;`
    let queryUpdateSalaries = `UPDATE Salaries SET job_id = ${data.job_id}, annual_pay = ${data.salary}, bonus = ${data.bonus} WHERE salary_id = ${data.salary_id};`;
  
    db.pool.query(disableFKCheck, function(error, rows, fields)
    {
        if (error) 
        {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            db.pool.query(queryUpdateSalaries, function(error, rows, fields)
            {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    db.pool.query(enableFKCheck, function(error, rows, fields)
                    {
                        if (error) 
                        {
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else
                        {
                            res.send(rows);
                        }    
                    })
                }
            })
        }
    });
});
    

// EMPLOYEESTOJOBS

app.get('/employeestojobs', (req,res) => {
    let query1 = `SELECT ej.emp_to_job_id, 
       e.emp_id, 
       e.emp_name, 
       j.job_id, 
       j.job_title
    FROM Employees_to_Jobs ej
    JOIN Employees e ON ej.emp_id = e.emp_id
    JOIN Jobs j ON ej.job_id = j.job_id
    ORDER BY ej.emp_to_job_id ASC ; `;

    db.pool.query(query1, function(error, rows, fields){
        console.log({data:rows});
        res.render('employeestojobs', {data:rows});
    }); 
});

app.post('/add-assignment', function(req,res){
    let data = req.body;
    console.log(data)

    // check for invalid data entry
    let emp_id = parseInt(data['input-emp-id-assignment']);
    let job_id = parseInt(data['input-job-id-assignment']);


    // calendar selector already places in YYYY-MM-DD format
    let query1 = `INSERT INTO Employees_to_Jobs (emp_id, job_id) VALUES ('${emp_id}', ${job_id});`
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else{
            res.redirect('/employeestojobs');
        }
    })
});

app.delete('/delete-assignment-ajax/', function (req,res,next){
    let data = req.body;
    let emp_to_job_id = parseInt(data.emp_to_job_id);
    let deleteEmployee = `DELETE FROM Employees_to_Jobs WHERE emp_to_job_id = ${emp_to_job_id}`;

    db.pool.query(deleteEmployee, [emp_to_job_id], function(error, rows, fields){
        if(error){
            console.log(error); // log error for troubleshooting
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
            
        
    })
});

app.put('/put-assignment-ajax', function(req,res,next){
    let data = req.body;
    console.log(data)

    

    let queryUpdateSalaries = `UPDATE Employees_to_Jobs SET job_id = ${data.job_id}, emp_id = ${data.emp_id} WHERE emp_to_job_id = ${data.ej_id};`;
  
        db.pool.query(queryUpdateSalaries, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            }
        });
});
// listener for debugging
app.listen(PORT, () => {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '/ ; press Ctrl-C to terminate.')
});
