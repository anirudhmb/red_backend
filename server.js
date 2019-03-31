const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000;
const router = express.Router();

let user = require('./user.model');

app.use(cors());
app.use(bodyParser.json());
app.use('/user', router);

mongoose.set('debug', true);

mongoose.connect('mongodb://127.0.0.1:27017/userdb', { useNewUrlParser: true });
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
    //device_id present in -> req.devid
    user.findOne({ email_id: req.body.mail }, function (err, users) {
        if (err) {
            console.log("=====================");
            console.log(err);
            return res.status(400).send('user not found');
        }
        else if (!users) {
            return res.status(404).send('user not found');
        }

        if (req.body.pwd == users.password && req.body.devid == users.device_id) {
            res.send(true);
        }
        else {
            res.send(false);
        }
        
    });
});


app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});