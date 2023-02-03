// import {getLocationOfOrder} from './separateapis/pickup/index';
const mysql = require('mysql');
const express = require('express');
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');


//app.use(express.json());

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

  // Starting our app.

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const db = mysql.createConnection({
    host     : 'localhost',// Your connection adress (localhost).
    user     : 'root',     // Your database's username.
    password : 'manager',        // Your database's password.
    database : 'sampledatabase',   // Your database's name.
    port:3307,

});
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2020.harsh.loya@ves.ac.in',
    pass: 'Harsh@1913'
  }
});

db.connect((err)=>{
  if (err) throw err;
  console.log('connectioon done');
});

app.get('/', function (req, res) {
  // Connecting to the database.
  res.send('<p>hi pranav here</p>')

});
  

  
  // Creating a GET route that returns data from the 'users' table.
app.get('/users', function (req, res) {
  console.log('req received');
      // Connecting to the database.
      let sql = 'SELECT * FROM markinfo';
      db.query(sql, function (err, result) {
        if (err) return console.error(err);
        result= JSON.parse(JSON.stringify(result));
        console.log(result[0]);
        res.send(result[0]);
      })
  
});
app.post('/emailsend', function(req, res){
  // console.log(req.body);
  // console.log(req.body.myemail.email);
  let email = req.body.myemail;
  const otpnum = Math.floor(1000 + Math.random() * 9000);
  var mailOptions = {
    from: '2020.harsh.loya@ves.ac.in',
    to: req.body.myemail.email,
    subject: 'OTP FOR DIGIVIKRETA',
    text: `Your otp is ${otpnum}`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.send({recotp: otpnum});
    }
  });
  
});
app.post('/savestoreinfo', function (req, res){
  console.log('savestoreinfo called');
  console.log(req.body);
 
  let storename = req.body['maindata']['storename'];
  let location = req.body['maindata']['location'];
  let mobile = req.body['maindata']['mobile'];
  let storeowner = req.body['maindata']['storeowner'];
  let storemaintype = req.body['maindata']['storemaintype'];
  let kyctype = req.body['maindata']['kyctype'];
  let certificatenum = 'ssa';//req.body['maindata']['certificatenum'];
  let adharnum = req.body['maindata']['adharnum'];
  let email = 'pju';//req.body['maindata']['email'];
  let sid = Math.floor(1000000 + Math.random() * 90000);
  let certid = Math.floor(1000000 + Math.random() * 90000);
  let latitude = req.body['maindata']['latitude'];
  let longitude = req.body['maindata']['longitude'];
  let language = req.body['maindata']['language'];
  let rating = 10;
  let uid = req.body['maindata']['uid'];
  let sql = `INSERT INTO storeinfo VALUES (${sid},'${storename}','${location}','${mobile}','${storeowner}','${storemaintype}','${kyctype}','${certificatenum}', '${adharnum}', '${email}', ${certid}, ${latitude}, ${longitude}, '${language}', ${rating}, ${uid})`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
      console.log(result);
      db.query(`SELECT * FROM storeinfo where sid=${sid}`, (error, response) => {
        if (error) return console.error(error);
        else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: response
          })
        }

      })
      
      
    
    
    }
  })    
});

app.post('/upload', upload.single('document'),(req , res) => {
  console.log('file uploaded');
  console.log(req.file);
});
app.get('/getlocationinfooforder/?{id}', () => {
  let sql = 'select * from pickup-location where  pic_id = id';
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    result= JSON.parse(JSON.stringify(result));
    console.log(result[0]);
    res.send(result[0]);
  })
})

//storing data in usertable
app.post('/saveuser', function (req, res){
  console.log('saveuserinfo called');
  console.log(req.body);
 
  let email = req.body['maindata']['email'];
  let name = req.body['maindata']['name'];
  let role = req.body['maindata']['role'];
  
  let sql = `INSERT INTO user (email, name, role) VALUES ('${email}','${name}','${role}')`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
      console.log(result);

      db.query(`SELECT * FROM user where u_id=${result.insertId}`, (error, response) => {
        if (error) return console.error(error);
        else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: response
          })
        }

      }) 
    }
  })    
});

//fetching userinfo by id
app.post('/getuserinfobyid', function (req, res){
  console.log('getuserinfobyid called');
  console.log(req.body);
 
  let u_id = req.body['maindata']['u_id'];
  
  let sql = `select * from user where u_id = ${u_id}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//delete storeinfo by id
app.post('/deleteuserinfobyid', function (req, res){
  console.log('deleteuserinfobyid called');
  console.log(req.body);
 
  let sid = req.body['maindata']['sid'];
  
  let sql = `delete from storeinfo where sid = ${sid}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
            console.log("Number of records deleted: " + result.affectedRows);
          
    }
  })    
});

//get storeid for userid
app.post('/getstoreidforuserid', function (req, res){
  console.log('getstoreidforuserid called');
  console.log(req.body);
 
  let u_id = req.body['maindata']['u_id'];
  
  let sql = `select sid from storeinfo where u_id = ${u_id}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//get buyerid for userid
app.post('/getbuyeridforuserid', function (req, res){
  console.log('getbuyeridforuserid called');
  console.log(req.body);
 
  let u_id = req.body['maindata']['u_id'];
  
  let sql = `select b_id from buyer where u_id = ${u_id}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//get buyerlocation by buyerid
app.post('/getbuyerlocationforbuyerid', function (req, res){
  console.log('getbuyerlocationforbuyerid called');
  console.log(req.body);
 
  let b_id = req.body['maindata']['b_id'];
  
  let sql = `select pincode from buyer where b_id = ${b_id}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//get store location by buyerid
app.post('/getstorelocationforstoreid', function (req, res){
  console.log('getstorelocationforstoreid called');
  console.log(req.body);
 
  let sid = req.body['maindata']['sid'];
  
  let sql = `select location from storeinfo where sid = ${sid}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//get buyerinfo by buyerid
app.post('/getbuyerinfobybuyerid', function (req, res){
  console.log('getbuyerinfobybuyerid called');
  console.log(req.body);
 
  let b_id = req.body['maindata']['b_id'];
  
  let sql = `select * from buyer where b_id = ${b_id}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//get storeinfo by storeid
app.post('/getstoreinfostoreid', function (req, res){
  console.log('getstoreinfostoreid called');
  console.log(req.body);
 
  let sid = req.body['maindata']['sid'];
  
  let sql = `select * from storeinfo where sid = ${sid}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
          res.send({
            responsetext: 'success',
            responsecode: 200,
            data: result
          })
    }
  })    
});

//signup
app.post('/signup', function (req, res){
  console.log('signup called');
  console.log(req.body);
 
  let name = req.body['maindata']['name'] ? req.body['maindata']['name']: null;
  let role = req.body['maindata']['role'] ? req.body['maindata']['role']: null;//buyer seller
  let tablename = (role == 'seller') ? 'storeinfo': 'buyer';
  let primaryk = (role == 'seller') ? 'sid': 'b_id';
  let mobileNo = req.body['maindata']['mobileNo'] ? req.body['maindata']['mobileNo']: null;
  let password = req.body['maindata']['password'] ? req.body['maindata']['password']: null;
  let location = req.body['maindata']['location'] ? req.body['maindata']['location']: null;//for pincode
  var d = new Date();
  
  let updated = `${d.getHours()}: ${d.getMinutes()}: ${d.getSeconds()}`
  
  let sql = `INSERT INTO user ( name, role, mobileno, password, updated) VALUES ('${name}','${role}', ${mobileNo} ,'${password}','${updated}')`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
      console.log(result);
      let sid = Math.floor(1000000 + Math.random() * 90000);
      if(role == 'seller'){
        let insql = `INSERT INTO storeinfo ( sid, pincode, mobile, storeowner, storepassword, u_id) VALUES (${sid},'${location}', '${mobileNo}', '${name}' ,'${password}','${result.insertId}')`;
        db.query(insql, function(error, r){
          if(error) return console.log(error);
          else{
            console.log(r);
            res.send({
              responsetext: 'success',
              responsecode: 200,
              data: r
              // data: {
              //   loginstatus: 'login succe',

              // }
            })
          }
        })
      }
      else{
        let buysql = `INSERT INTO buyer ( pincode, u_id, city) VALUES ('${location}','${result.insertId}', 'nashik')`;
        db.query(buysql, function(error, r){
          if(error) return console.log(error);
          else{
            console.log(r);
            res.send({
              responsetext: 'success',
              responsecode: 200,
              data: r.insertId
            })
          }
        })

      }
      
      // db.query(`SELECT * FROM user where u_id=${result.insertId}`, (error, response) => {
      //   if (error) return console.error(error);
      //   else{
      //     res.send({
      //       responsetext: 'success',
      //       responsecode: 200,
      //       data: response
      //     })
      //   }

      // }) 
    }
  })    
});

//login
app.post('/login', function (req, res){
  console.log('login call');
  console.log(req.body);
  let mobileNo = req.body['maindata']['mobileNo'] ? req.body['maindata']['mobileNo']: null;
  let password = req.body['maindata']['password'] ? req.body['maindata']['password']: null;
  
  let sql = `select * from user where mobileno = ${mobileNo}`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    else{
      console.log(result);
     
      if(result.password == password){
        res.send({
          responsetext: 'success',
          responsecode: 200,
          data: {
            loginstatus: 'login successful',
            userinfo: result
          }
        })   
      }
      else{
        res.send({
          responsetext: 'success',
          responsecode: 200,
          data: {
            loginstatus: 'login failed',
            userinfo: null
          }
        })  

      }
    }
  })    
});






  // Starting our server.
app.listen(3000, () => {
   console.log('Go to http://localhost:3000/ so you can see the data.');
   ngrok.connect(3000).then((res) => {console.log(res);}).catch(err => {console.log(err);})
});

//fetching data from markinfo table
// app.post('/getmarkinfo', upload.single('document'),(req , res) => {
//   db.query("select * from markinfo",(err,result)=>{
//     console.warn("result",result)
//   })
// });

  
// //fetching data from product table
// db.query("select * from product",(err,result)=>{
//   console.warn("result",result)
// })

// //fetching data from storeinfo table
// db.query("select * from storeinfo",(err,result)=>{
//   console.warn("result",result)
// })

// //posting data in markinfo table
// app.post('/',(req,res)=>{
//  const data = req.body;
//  db.query("insert into markinfo set ?",data,(err,result)=>{
//   if(err){
//     res.send('Error');
//   }else{
//     res.send(result);
//   }
//  });

// });

// //posting data into storeinfo table
// app.post('/',(req,res)=>{
//   const data = req.body;
//   db.query("insert into storeinfo set ?",data,(err,result)=>{
//    if(err){
//      res.send('Error');
//    }else{
//      res.send(result);
//    }
//   });
 
//  });





