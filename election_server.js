const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const router = express.Router();

let election = require('./election.model');

app.use(cors());
app.use(bodyParser.json());
app.use('/elec', router);

mongoose.set('debug', true);

mongoose.connect('mongodb://127.0.0.1:27017/electiondb', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database(electiondb) connection established successfully");
})

//list all elections
router.route('/').get(function (req, res) {
    election.find(function (err, elections) {
        if (err) {
            console.log(err);
        } else {
            res.json(elections);
        }
    });
});

//create an election
router.route('/create').post(function (req, res) {
    let electionBody = new election(req.body);
    electionBody.save()
        .then(electionBody => {
            res.status(200).json({ 'election': 'election created successfully' })
        })
        .catch(err => {
            res.status(400).send('failed');
        });
});

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});