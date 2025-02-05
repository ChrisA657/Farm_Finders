const pool = require('./db');
const jwt = require('jsonwebtoken');

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });


  const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if(!token) {
      res.send("No JWT Token");
    } else {
      jwt.verify(token, process.env.JWTSECRET, (err, decoded)=>{
        if(err){
          res.json({auth: false, message:"Failed to authenticated"})
        } else {
          console.log("authenticated");
          res.locals.token = decoded;
          next();
        }
      });
    }
  }
  
  app.post('/api/accounts/register', (req, res) => { 
    let user = req.body.rUser.trim();
    let email = req.body.email.trim();
    let password = req.body.rPassword;
    //if there are any fields missing, throw error
    if(!user|| !email || !password){
      res.status(400).send('Missing Required Fields');
    } else {
      // obtain a connection from our pool of connections
      pool.getConnection(function (err, connection){
        if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else {
          // if there is no issue obtaining a connection, execute query
          connection.query('INSERT into `db`.`user`(`username`,`password`,`email`) values(?,?,?);',[user,password,email], function (err, rows, fields) {
            if (err) { 
              // if there is an error with the query, release the connection instance and log the error
              connection.release()
              logger.error("Problem Registering User: ", err); 
              res.status(400).send('Username/Email is already registered'); 
            } else {
                  // if there is no error with the query, release the connection instance
                  connection.release()
                  res.status(200).send('created user'); 
                }
          });
        }
      });
    }
});
  app.post('/api/accounts/login', (req, res) => {
    // obtain a connection from our pool of connections
    let username = req.body.user;
    let password = req.body.password;
    pool.getConnection(function (err, connection){
      if (err){
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('SELECT id, username, password from `db`.`user` where username=?;',[username], function (err, rows, fields) {
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            connection.release()
            logger.error("Problem Logging in: ", err); 
            res.status(400).send('Problem Logging in '); 
          } else {
                //if no field is returned, no user with the given username exists
                if(!rows.length){
                  res.status(401).send('Username not registered');
                } else {
                    //if there is no error, check if passwords match
                      if(rows[0].password === password) {
                        console.log("Successful login");
                        const id = rows[0].id;
                        const username = rows[0].username;
                        const token = jwt.sign({id: id, username: username },process.env.JWTSECRET,{expiresIn:60*60});
                        res.status(200).send({userToken: token});
                      } else {
                      console.log("failed login")
                      res.status(401).send('Incorrect Password');
                    }
              }
              }
        });
      }
    });
  });
  app.get('/api/farms/:id', (req, res) => {
    const id = req.params.id;
    // obtain a connection from our pool of connections
    console.log(id);
    pool.getConnection(function (err, connection) {
      if (err){
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('select description from Farm where id = ?;',[id], function (err, rows, fields) {
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            connection.release()
            logger.error("Problem Logging in: ", err); 
            res.status(400).send('Problem Logging in '); 
          } else {
                //if no field is returned, no data for that farm
                if(!rows.length){
                  res.status(401).send('Farm does not exist');
                } else {
                    //if there is no error, return farm data
                    res.status(200).json(rows[0]);
                }
              }
        });
      }
    });
  });

  app.put('/api/farms/description', verifyJWT, (req, res) => {
    // obtain a connection from our pool of connections
    console.log(res.locals)
    const id = res.locals.token.id;
    console.log("whoo");
    const newDesc = req.body.newDescription;
    pool.getConnection(function (err, connection){
      if (err){
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('UPDATE Farm set description = ? where id = ?;',[newDesc, id], function (err, rows, fields) {
          if (err) { 
            console.log(err);
          } else {
            res.status(200).json(newDesc);
          }
        });
      }
    });
  });
   
  // POST /reset
  app.post('/reset', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if (err){
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('drop table if exists test_table', function (err, rows, fields) {
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            connection.release()
            logger.error("Problem dropping the table test_table: ", err); 
            res.status(400).send('Problem dropping the table'); 
          } else {
            // if there is no error with the query, execute the next query and do not release the connection yet
            connection.query('CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);', function (err, rows, fields) {
              if (err) { 
                // if there is an error with the query, release the connection instance and log the error
                connection.release()
                logger.error("Problem creating the table test_table: ", err);
                res.status(400).send('Problem creating the table'); 
              } else { 
                // if there is no error with the query, release the connection instance
                connection.release()
                res.status(200).send('created the table'); 
              }
            });
          }
        });
      }
    });
  });

  // POST /multplynumber
  app.post('/multplynumber', (req, res) => {
    console.log(req.body.product);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${req.body.product} to the table!`);
          }
        });
      }
    });
  });

  // GET /checkdb
  app.get('/values', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT value FROM `db`.`test_table`', function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
  });
}