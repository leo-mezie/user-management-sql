const mysql = require('mysql');

// connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME       
});

exports.view = (req, res)=>{
    
    // connect db
    pool.getConnection((err, connection)=>{
    if(err)throw err; //not connected
    console.log('Connected as ID ' + connection.threadId)


    // user connection to view db data
    connection.query("SELECT * FROM users", (err, rows)=>{
        // when done with connection release it
        connection.release();

        // if no error display data
        if(!err){
                let removedUser = req.query.removed;
                res.render("home",{rows, removedUser });
        }else{
            console.log(err);
        }
        console.log("the data from user table: \n", rows);
    })
})

}

// find user by search
exports.find = (req,res)=>{

      // connect db
      pool.getConnection((err, connection)=>{
        if(err)throw err; //not connected
        console.log('Connected as ID ' + connection.threadId)

        let searchTerm = req.body.search;
        console.log(searchTerm)
    
    
        // user connection to view db data
        // use ? to prevent sql injection
        connection.query("SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? ", ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows)=>{
            // when done with connection release it
            connection.release();
    
            // if no error display data
            if(!err){
                    //route/nav
                    // display this route 
                    // we also pass data from db using rows
                    // like this {rows}
                    res.render("home",{rows});
            }else{
                console.log(err);
            }
            console.log("the data from user table: \n", rows);
        })
    })


}



exports.newUser = (req,res)=>{
    res.render('new-user')
    }
            
            // add new user 
            exports.postNewUser = (req,res)=>{

                    // destructure data
                    const { first_name, last_name, email, phone, comment } = req.body;
                  

                    pool.getConnection((err, connection)=>{
                    if(err)throw err; //not connected
                    console.log('Connected as ID ' + connection.threadId)

                    let searchTerm = req.body.search;
                    // console.log(searchTerm)


                    // user connection to view db data
                    // use ? to prevent sql injection
                    connection.query('INSERT INTO users SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ?', [first_name, last_name, email, phone, comment],(err, rows)=>{
                    // when done with connection release it
                    connection.release();

                        // if no error display data
                        if(!err){
                            
                                res.render("new-user",{alert:"User Added Succesfully "});
                        }else{
                            console.log(err);
                        }
                        console.log("the data from user table: \n", rows);
                    })
                })
            
            
            }



//edit user 
exports.edit = (req,res)=>{
          // connect db
    pool.getConnection((err, connection)=>{
        if(err)throw err; //not connected
        console.log('Connected as ID ' + connection.threadId)
        // user connection to view db data
        connection.query("SELECT * FROM users WHERE id = ?",[req.params.id], (err, rows)=>{
            // when done with connection release it
            connection.release();
            // if no error display data
            if(!err){
                    //route/nav
                    // display this route 
                    // we also pass data from db using rows
                    // like this {rows}
                    res.render("edit-user",{rows});
            }else{
                console.log(err);
            }
            console.log("the data from user table: \n", rows);
        });
    });

     }




  //update user 
exports.update = (req,res)=>{
// destructure data
const { first_name, last_name, email, phone, comment } = req.body;
        // connect db
      pool.getConnection((err, connection)=>{
      if(err)throw err; //not connected
      console.log('Connected as ID ' + connection.threadId)
      // user connection to view db data
      connection.query("UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, comment = ? WHERE id = ?",[first_name, last_name, email, phone, comment, req.params.id], (err, rows)=>{
          // when done with connection release it
          connection.release();
  
          // if no error display data
          if(!err){
                //   after updating 
                // post it again to db
                // connect db
        pool.getConnection((err, connection)=>{
        if(err)throw err; //not connected
        console.log('Connected as ID ' + connection.threadId)
    
    
            // user connection to view db data
            connection.query("SELECT * FROM users WHERE id = ?",[req.params.id], (err, rows)=>{
            // when done with connection release it
            connection.release();
    
            // if no error display data
            if(!err){
                    //route/nav
                    // display this route 
                    // we also pass data from db using rows
                    // like this {rows}
                    res.render("edit-user",{rows, alert:`user ${first_name} has been updated successfully`});
            }else{
                console.log(err);
            }
            console.log("the data from user table: \n", rows);
        });
    });
          }else{
              console.log(err);
          }
          console.log("the data from user table: \n", rows);
      })
  })
}



//delete user 
exports.delete = (req,res)=>{
    // connect db
pool.getConnection((err, connection)=>{
  if(err)throw err; 
    console.log('Connected as ID ' + connection.threadId)
  // delete querry
  connection.query("DELETE FROM users WHERE id = ?",[req.params.id], (err, rows)=>{
      
      connection.release();
      // if no error display data
      if(!err){       
           
        let removedUser = encodeURIComponent('User Successfully Removed')
            res.redirect('/?removed=' + removedUser);
            
      }else{
          console.log(err);
      }
      console.log("the data from user table: \n", rows);
  });
});

}


// view user
exports.viewUser = (req, res)=>{
    
    // connect db
    pool.getConnection((err, connection)=>{
    if(err)throw err; 
    console.log('Connected as ID ' + connection.threadId)
    // user connection to view db data
    connection.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, rows)=>{
       
        connection.release();

        // if no error display data
        if(!err){
     
                res.render("view-user",{rows});
        }else{
            console.log(err);
        }
        console.log("the data from user table: \n", rows);
    })
})

}