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

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});