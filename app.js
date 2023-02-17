const express = require('express');

const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const mysql = require ('mysql');
require('dotenv').config();

const app = express();

// environment port number or 3000 
const port = process.env.PORT || 3000;

// body parser first after seting port
// parsing middleware
// parse application /x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json())

// 2nd step
// to access static files and folder
app.use(express.static('public'))


// 3rd step
// template engine config
app.engine('hbs', exphbs({extname: '.hbs'}));
// set view engine as hbs
app.set('view engine', 'hbs');


// connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME       
});

// connect db
pool.getConnection((err, connection)=>{
    if(err)throw err; //not connected
    console.log('Connected as ID ' + connection.threadId)
})


const routes = require('./server/routes/user');
app.use('/', routes);



app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`)
});