const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000;
const router = express.Router();
var http = require('http');

let user = require('./user.model');

app.use(cors());
app.use(bodyParser.json());
app.use('/user', router);

mongoose.set('debug', true);

//mongoose.connect('mongodb://127.0.0.1:27017/userdb', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://dbUser:dbPass@cluster0-hgbdj.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database(userdb) connection established successfully");
})

//func to get all the user details
router.route('/').get(function (req, res) {
    user.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

//func to get all the user details by constituency
router.route('/:con').get(function (req, res) {
    user.find({constituency:req.params.con}, function (err, users) {
        if (err) {
            return res.status(400).send("error");
        }
        else {
            res.json(users);
        }
    });
});

//func to create new user
router.route('/create').post(function (req, res) {
    let userBody = new user(req.body);
    userBody.save()
        .then(userBody => {
            res.status(200).json({ 'user': 'user added successfully' })
        })
        .catch(err => {
            res.status(400).send('failed');
        });
});

//function to signin the user
//send the email id and password as POST variables
router.route('/signin').post(function (req, res) {
    //email_id is present in -> req.body.mail
    //password present in -> req.body.pwd
    //device_id present in -> req.body.device_id
    //role present in -> req.body.role
    user.findOne({ email_id: req.body.mail }, function (err, users) {
        if (err) {
            console.log("=====================");
            console.log(err);
            return res.status(400).send('user not found');
        }
        else if (!users) {
            return res.status(404).send('user not found');
        }

        if(req.body.mail==users.email_id && req.body.pwd==users.password){
          console.log(users);
          if(typeof req.body.device_id == undefined){
            if(users.role=="ecp_admin"){
              return res.status(200).json({"role":"ecp_admin","action":"portal signin"});
            } else {
              return res.status(401).json({"role":"user","action":"unauthorized access"});
            }
          }
          user.findOne({device_id: req.body.device_id}, function(err, docs){
            if(err){
              console.log(err);
              return res.status(400).json({"error":err});
            }
            else if(!docs){
              if(users.role=="ecp_admin"){
                return res.status(200).json({"role":"ecp_admin","action":"allocate_device"});
              } else {
                return res.status(401).json({"role":"user","action":"unauthorized access"});
              }
            }

            if(users.role=="ecp_admin"){
              return res.status(200).json({"role":"ecp_admin","action":"null"});
            } else {
              return res.status(200).json({"role":"user", "action":"successfull login", "constituency":users.constituency});
            }
          });
        } else {
          return res.status(401).json({"role":"user","action":"unauthorized access"});
        }
    });
});

//to allocate device to the users
//send adhaar_card_number and device_id as POST variables
router.route('/alloc').post(function(req,res){
  //adhaar_card_number present in -> adhaar
  //device_id present in -> device_id
  user.findOneAndUpdate(
    {adhaar_card_number : req.body.adhaar},
    {$set:{device_id:req.body.device_id}},
    {new: true},
    (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
          return res.status(400).send("error allocating device.");
      }

      console.log(doc);
      res.send("successfull");
    }
  );
});


app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
