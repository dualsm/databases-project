// URL: https://canvas.oregonstate.edu/courses/1967354/assignments/9690199?module_item_id=24460781
// Date Retrieved: 6/26/2024
// Title: Connect webapp to database (Individual)
// Type: Tutorial Code
// Author: Canvas Module

// Setup
// setting up port to use, express instance created
var express = require('express');
var app = express();
let PORT = 44082

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

// load css for all pages (added as a local in each response)
var css_arr = ['main', 'employees']
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
            console.log({data:rows});
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
        homeworld = 'NULL'
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



app.get('/departments', (req,res) => {
    res.render('departments'); 
});

app.get('/jobs', (req,res) => {
    res.render('jobs'); 
});

app.get('/salaries', (req,res) => {
    res.render('salaries'); 
});

app.get('/employeestojobs', (req,res) => {
    res.render('employeestojobs'); 
});

// listener for debugging
app.listen(PORT, () => {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '/ ; press Ctrl-C to terminate.')
});
