
// Date Retrieved: 7/25/2024
// Title: My Activity 2
// Type: Tutorial Code
// Author: Canvas Module


// Get an instance of mysql we can use in the app

var mysql = require('mysql')

// Create a connection pool using the provided credentials

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'INSERT MYSQL HOST HERE',
    user: 'USERNAME',
    password: 'PASSWORD',
    database: 'DATABASE NAME'
})

// export it for use in our application

module.exports.pool = pool;

