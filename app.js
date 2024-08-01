// URL: https://canvas.oregonstate.edu/courses/1967354/assignments/9690199?module_item_id=24460781
// Date Retrieved: 6/26/2024
// Title: Connect webapp to database (Individual)
// Type: Tutorial Code
// Author: Canvas Module

// Setup
// setting up port to use, express instance created
var express = require('express');
var app = express();
let PORT = 44080

// database
var db = require('./database/db-connector')

// setup handlebars engine
const { engine } = require('express-handlebars'); // const engine will create the engine
var exphbs = require('express-handlebars'); // imports handlebars
app.engine('.hbs', engine({extname: ".hbs"})); // create engine to recognize .hbs
app.set('view engine', '.hbs'); // use handlebars engine when encounters the .hbs extension


// ROUTES
app.get('/', (req,res) => {
    res.render('index'); // render guarantees engine will render webpage before sending HTML to client
});

app.get('/employees', (req,res) => {
    res.render('employees'); // render guarantees engine will render webpage before sending HTML to client
});

app.get('/departments', (req,res) => {
    res.render('departments'); // render guarantees engine will render webpage before sending HTML to client
});

app.get('/jobs', (req,res) => {
    res.render('jobs'); // render guarantees engine will render webpage before sending HTML to client
});

app.get('/salaries', (req,res) => {
    res.render('salaries'); // render guarantees engine will render webpage before sending HTML to client
});

// listener for debugging
app.listen(PORT, () => {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu/:' + PORT + '; press Ctrl-C to terminate.')
});
