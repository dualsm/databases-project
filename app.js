// URL: https://canvas.oregonstate.edu/courses/1967354/assignments/9690199?module_item_id=24460781
// Date Retrieved: 6/26/2024
// Title: Connect webapp to database (Individual)
// Type: Tutorial Code
// Author: Canvas Module

// Setup
// setting up port to use, express instance created
var express = require('express');
var app = express();
let PORT = 44083

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
    // maybe since i already got all data I need from this 'Employees' I don't need 2nd query
    db.pool.query(query1, function(error, rows, fields){
        // db.pool.query(query2, function(error, rows, fields){
            // console.log({data:rows});
            res.render('employees', {data:rows});
        // })
     })
    
});

app.post('/add-employee-form', function(req,res){
    let data = req.body;

    // check for invalid data entry
    // WILL RETURN TO SANITIZE
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
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(queryRefillTable, [data.emp_name, data.hire_date, emp_id],function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(200);
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
    // WILL RETURN TO SANITIZE
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

app.get('/jobs', (req,res) => {
    let query1 = `SELECT job_id, job_title, dep_id FROM Jobs;`;

    db.pool.query(query1, function(error, rows, fields){
        console.log({data:rows});
        res.render('jobs', {data:rows});
    }); 
});

app.get('/salaries', (req,res) => {
    let query1 = `SELECT salary_id, job_id, annual_pay, bonus FROM Salaries;`;

    db.pool.query(query1, function(error, rows, fields){
        console.log({data:rows});
        res.render('salaries', {data:rows});
    }); 
});

app.get('/employeestojobs', (req,res) => {
    res.render('employeestojobs'); 
});

// listener for debugging
app.listen(PORT, () => {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '/ ; press Ctrl-C to terminate.')
});
