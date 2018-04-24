var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
// var PythonShell = require('python-shell');
// var pyshell = new PythonShell('hello.py');
// var pyshell2 = new PythonShell('world.py');
app.use(bodyParser.json());

var connection = mysql.createConnection({
  host: 'cs411-tripoptimizer.c3jbpbfvqkol.us-east-2.rds.amazonaws.com',
  user: 'master',
  password: 'uiuccs411',
  port: 3293,
  database: 'cs411_tripoptimizer'
});

connection.connect(function(err){
  if(err){
    throw err;
  }
  console.log("connected to database!");
  
});

function parseDate(dob){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  var res = dob.split("-");
  var dob_mm = res[0];
  var dob_dd = res[1];
  var dob_yyyy = res[2];
  var age = yyyy-dob_yyyy
  if (mm<dob_mm) {age = age-1;}
  else if (mm==dob_mm){
    if (dd<dob_dd){age = age-1;}
  }
  return age;
}
app.get('/place/categorize', function(req,res){
  var q_city = " "
  if(req.query.city!=undefined)
    q_city = " WHERE city LIKE '%"+req.query.city+"%' "
  var query = "SELECT category, COUNT(*) FROM Place"+q_city+"GROUP BY category";
  console.log(query);
  connection.query(query, function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "Place with city "+req.query.city+" Not Found"
      });
    }
    else{
      res.status(200).json(
        results
      );
    }
  });
});


app.get('/place', function(req,res){
  var query = "SELECT * FROM Place";
  var qflag = 0;
  if(req.query.name!=undefined || req.query.city!=undefined || req.query.category!=undefined){
    query = query+" WHERE ";
    if(req.query.name!=undefined){
      qflag = 1;
      query = query+"name LIKE '%"+req.query.name+"%'";
    }
    if(req.query.city!=undefined){
      if(qflag===1)
        query = query+" AND ";
      qflag = 1;
      query = query+"city LIKE '%"+req.query.city+"%'";
    }
    if(req.query.category!=undefined){
      if(qflag===1)
        query = query+" AND ";
      query = query+"category LIKE '%"+req.query.category+"%'";
    }
  }
  console.log(query);
  connection.query(query, function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "Place Not Found"
      });
    }
    else{
      res.status(200).json(
        results
      );
    }
  });
});


app.get('/place/:id', function(req,res){
  let pid = req.params.id
  connection.query("SELECT * FROM Place WHERE pid='"+pid+"'", function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "Place "+pid+" Not Found"
      });
    }//var obj = JSON.parse(results)
    else{
      res.status(200).json(
        results
      );
    }
  });
});

app.get('/user/freq', function(req,res){
  var q_age = " ";
  var q_limit = "";
  if(req.query.age!=undefined)
    q_age = " WHERE age="+req.query.age+" "
  if(req.query.limit!=undefined)
    q_limit =  " LIMIT "+req.query.limit
  var query = "SELECT city, COUNT(city) AS occur FROM User INNER JOIN Trip ON User.email = Trip.email"+q_age+"GROUP BY city ORDER BY occur DESC"+q_limit;
  connection.query(query, function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "Not Found"
      });
    }
    else{
      res.status(200).json(
        results
      );
    }
  });
});

app.get('/user', function(req,res){
  connection.query("SELECT * FROM User", function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "User Not Found"
      });
    }
    else{
      res.status(200).json(
        results
      );
    }
  });
});

app.get('/user/:id', function(req,res){
  var uid = req.params.id;
  connection.query("SELECT * FROM User WHERE email='"+uid+"'", function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "User "+uid+" Not Found"
      });
    }
    else{
      res.status(200).json(
        results
      );
    }
  });
});


app.get('/user/:id/trip', function(req,res){
  var uid = req.params.id;
  connection.query("SELECT * FROM Trip WHERE email='"+uid+"'", function(err,results,fields){
    if(err) throw err;
    res.status(200).json(
      results
    );
  });
});

app.delete('/user/:uid/trip/:tid',function(req,res){
  let uid = req.params.uid;
  let tid = req.params.tid;
  connection.query("DELETE FROM Trip WHERE email='"+uid+"' AND tid='"+tid+"'", function(err,results,fields){
    if(err) throw err;
    if(results.affectedRows===0){
        res.status(404).json({
          message: "Not Found"
        });
    }
    else{
      res.status(200).json({
        message: tid+" Deleted"
      });
    }
  });
});


app.post('/user/:uid/trip', function(req,res){
  var uid = req.params.uid;
  var random_tid = uuidv4();
  var tripdata = {
    tid: random_tid,
    email: uid,
    city: req.body.city,
    itinerary: req.body.itinerary,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    startLocation: req.body.startLocation,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }
  connection.query("INSERT INTO Trip VALUES (?,?,?,?,?,?,?,?,?)",
    [tripdata.tid,tripdata.email,tripdata.city,tripdata.itinerary,tripdata.latitude,tripdata.longitude,tripdata.startLocation,tripdata.startDate,tripdata.endDate],function(err,results,fields){
    if(err){
      if (err.code == 'ER_DUP_ENTRY'){
        res.status(409).json({
          tripdata
        });
      }
      else{
        res.status(500).json({
          "message": "Internal Error"
        });
      }
    }
    else{
      res.status(201).json({
        tripdata
      });
    }
  });
});

//////////////////////getting data that does not exist (data = [])///////////////////////
app.get('/user/:uid/trip/:tid', function(req,res){
  var uid = req.params.uid;
  var tid = req.params.tid;
  connection.query("SELECT * FROM Trip WHERE tid='"+tid+"' AND email='"+uid+"'", function(err,results,fields){
    if(err) throw err;
    if(results.length===0){
      res.status(404).json({
        message: "User "+uid+" with Trip data "+tid+" Not Found"
      });
    }
    else{
      res.status(200).json(
        results
      );
    }
  });
});

app.post('/user', function(req,res){
  var age = parseDate(req.body.birthDate);
  var userdata = {
    email: req.body.email,
    name: req.body.name,
    age: age,
    birthDate: req.body.birthDate,
    address: req.body.address
  }
  connection.query("INSERT INTO User VALUES (?,?,?,?,?)",
    [userdata.email,userdata.name,userdata.age,userdata.birthDate,userdata.address],function(err,results,fields){
    if(err){
      if (err.code == 'ER_DUP_ENTRY'){
        res.status(409).json({
          userdata
        });
      }
      else{
        res.status(500).json({
          "message": "Internal Error"
        });
      }
    }
    else{
      res.status(201).json(
        userdata
      );
    }
  });
});

app.put('/user/:uid/trip/:tid', function(req,res){
  let uid = req.params.uid;
  let tid = req.params.tid;

  connection.query("SELECT * FROM Trip WHERE email = '"+uid+"' AND tid ='"+tid+"'", function(err, results, fields){
  var tripdata = {
    tid: tid,
    email: uid,
    city: results[0].city,
    itinerary: req.body.itinerary,
    startLocation: req.body.startLocation,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  }

  if(err) throw err;
  if(req.body.itinerary == undefined){
    tripdata.itinerary = results[0].itinerary;
  }
  if(req.body.startLocation == undefined){
    tripdata.startLocation = results[0].startLocation;
  }
  if(req.body.startDate == undefined){
    tripdata.startDate = results[0].startDate;
  }
  if(req.body.endDate == undefined){
    tripdata.endDate = results[0].endDate;
  }
    connection.query("UPDATE Trip SET itinerary = ?, startLocation = ?, startDate = ?, endDate = ? WHERE tid = '"+tid+"' AND email = '"+uid+"' " ,
      [tripdata.itinerary, tripdata.startLocation, tripdata.startDate, tripdata.endDate],function(err,rows,fields){
      if(err){
          res.status(500).json({
          "message": "Internal Error"
          });
      }
      else{
        res.status(200).json(
          tripdata
        );
      }
    });
  });
});

app.delete('/user/:id',function(req,res){
  var uid = req.params.id;
  connection.query("DELETE FROM User WHERE email='"+uid+"'", function(err,results,fields){
    if(err) throw err;
    if(results.affectedRows===0){
        res.status(404).json({
          message: "User "+uid+" Not Found"
        });
    }
    else{
      res.status(200).json({
        message: uid+" Deleted"
      });
    }
  });
});


app.listen(3000, function(){console.log("started on port 3000")});

module.exports = app;
