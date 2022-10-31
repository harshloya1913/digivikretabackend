const mysql = require('mysql');
const express = require('express');
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

  // Starting our app.

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const db = mysql.createConnection({
    host     : 'localhost', // Your connection adress (localhost).
    user     : 'root',     // Your database's username.
    password : '',        // Your database's password.
    database : 'sampledatabase',   // Your database's name.
   

});
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2020.pranav.ubarhande@ves.ac.in',
    pass: 'Urcreature@1'
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
    from: '2020.pranav.ubarhande@ves.ac.in',
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
  let sid = Date.now();
  let certid = Date.now();
  let sql = `INSERT INTO storeinfo VALUES (${sid},'${storename}','${location}','${mobile}','${storeowner}','${storemaintype}','${kyctype}','${certificatenum}', '${adharnum}', '${email}', ${certid})`;
  db.query(sql, function (err, result) {
    if (err) return console.error(err);
    
    res.send('success');
  })    
});

app.post('/upload', upload.single('document'),(req , res) => {
  console.log('file uploaded');
  console.log(req.file);
});
  
  // Starting our server.
app.listen(3000, () => {
   console.log('Go to http://localhost:3000/ so you can see the data.');
});
  