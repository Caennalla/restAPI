var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// Mysql connection data
var pool = mysql.createPool({
	connectionLimit: 100,
	host: "localhost",
	user: "admin",
	password: "1234",
	database: "UserDatabase",
	debug: false
});

/*/connection.connect();

var testQuery = connection.query('select * from users');
console.log(testQuery);

connection.query('SELECT * FROM users', function(err, rows, fields){
	if(!err) console.log(rows);
	else console.log("error ", err);
}); /*/

// A few parser functions for later use
var jsonParser = bodyParser.json({verify: rawBodySaver});

var urlencodedParser = bodyParser.urlencoded({extended: false});

// Init
var app = express();

// This return 404 ??
app.delete('api/users/:username', function(req,res){

	var username = req.params.username;
	var query = 'SELECT * from users WHERE Username=\'' + username + '\'';

	pool.getConnection(function (err, connection) {
	    if (err) {
	        console.log("Error: ", err);
	        res.json({"message": "Couldn't connect to database"});
	    }
	    else if(connection){
			connection.query(query, function (err, rows, fields) {
			    
			    if(err){
			        console.log("Error: ", err);
		    	}
				else{
					if(rows.length > 0){
						query = 'DELETE FROM users WHERE Username=\''+ username + '\'';
						connection.query(query, function(err,rows,fields){
							connection.release();
							if(err){
								 console.log(err);
							}
							else{
								console.log("User deleted");
								res.json({"message": "User deleted"});
							}
						});
						
					}
					else{
						connection.release();
						res.json({"message": "No users with that name"});
					}
					
				}
			});
		}
		else{
			console.log("Error: ", err);
			res.json({"message": "Error occured"});
		}
	});
});

// GET /api/users

app.get('/api/users', function(req,res){
	var query = 'SELECT * FROM users';

	pool.getConnection(function (err, connection) {
	    if (err) {
	        console.log("Error: ", err);
	    }
	    else if (connection) {
	        connection.query(query, function (err, rows, fields) {
	            connection.release();
	            console.log(rows);
	            if (err) {
	                console.log("Error: ", err);
	            }
	            else{
	            	res.send(JSON.stringify(rows));
	            }
	        })
	    }
	    else {
	        console.log("No connection");
	    }
	});
});

// GET specific id /api/users/id
app.get('/api/users/:usersid', function(req, res){
	var usersid = req.params.usersid;

	var query = 'SELECT * FROM users WHERE ID = ' + usersid;
	console.log(query);

	pool.getConnection(function (err, connection) {
	    if (err) {
	        console.log("Error: ", err);
	    }
	    else if (connection) {
	        connection.query(query, function (err, rows, fields) {
	            connection.release();
	            console.log(rows);
	            if (err) {
	                console.log("Error: ", err);
	            }
	            else{
	            	res.send(JSON.stringify(rows));
	            }
	        })
	    }
	    else {
	        console.log("No connection");
	    }
	});
});

// POST /api/tool using json bodies
app.post('/api/users',jsonParser, function(req,res){
	if(!req.body) res.json({"message": "no data"});

	//Save the username for checking for it
	var username = req.body.username;
	if(!username) res.json({"message": "no username given"});

	//If everything checks out this far, let's do mySQL queries
	//This one is for checking if username already exists
	var checkQuery = 'SELECT * FROM users WHERE Username=' + '\''+username+'\'';
	console.log(checkQuery);
	//The actual query to insert stuff
	//console.log(query);

	pool.getConnection(function (err, connection) {
	    if (err) {
	        console.log("Error: ", err);
	    }
	    else if (connection) {
	    	//First we'll check if we can find something with the given username
	        connection.query(checkQuery, function (err, rows, fields) {
	        	console.log(rows.length);
	            if (err) {
	                console.log("Error: ", err);
	                connection.release();
	            }
	            else{
	            	//If there is anything found, update data
	            	if(rows.length > 0){
	            		// Build mySQL query with each parameter
	            		var query = 'UPDATE users ';
	            		var helpNumber = 0;

	            		if(req.body.email){
	            			query += 'SET Email=\'' + req.body.email + '\'';
	            			helpNumber++;
	            		}
	            		
	            		if(req.body.password){
	            			if(helpNumber > 0) query +=', Password=\'' + req.body.password + '\'';
	            			else query += 'SET Password=\'' + req.body.password + '\'';
	            			helpNumber++;
	            		}

	            		if(req.body.name){
	            			if(helpNumber > 0) query +=', Name=\'' + req.body.name + '\'';
	            			else query += 'SET Name=\'' + req.body.name + '\'';
	            		}

	            		//console.log(query);
	            		
	            		// End query
	            		query += ' WHERE Username=' + '\''+username+'\'';
	            		// Execute mySQL command
	            		connection.query(query, function (err, rows, fields) {
            				connection.release();
	            			if(err){
	            				console.log("Error: ", err);
	            			}
	            			else{
	            				console.log("Updated data in database");
	            				res.json({"message": "Data updated"});
	            			}
            			});
	            	}
	            	else{
	            		//Otherwise add new user
	            		var query = 'INSERT INTO users(Username, Email, Password, Name) VALUES (\''+ req.body.username +'\''+',' + ' \''+ req.body.email +'\''+',' + '\''+ req.body.password+ '\''+',' + '\''+ req.body.name+ '\')';

	            		connection.query(query, function (err, rows, fields) {
	            			connection.release();
	            			if(err){
	            				console.log("Error: ", err);
	            			}
	            			else{
	            				console.log("Added data to database");
	            				res.json({"message": "User added"});
	            			}
	            		});
	            	}
	            }
	        });
	    }
	    else {
	        console.log("No connection");
	    }
	});
});


//
var rawBodySaver = function(req, res, buf, encoding){
	if(buf && buf.length){
		req.rawBody = buf.toString(encoding || 'utf8');
	}

};



app.listen(8080);
console.log("Server is running on 8080");
