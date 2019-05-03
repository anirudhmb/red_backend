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

// router.route('/vote/:id/:party').get(function (req, res) {
//   election.findOne({"_id":req.params.id, "candidates":{$elemMatch: {"party_name": req.params.party}}}, function(err, elections) {
//        if (err) { console.log(err); }
//        else { res.json(elections); }
//      });
// });


//Update vote in the database
router.route('/list/:id/:canid').get(function (req, res){
  election.findById(req.params.id, function(err, elections) {
    if(err){
      console.log(err);
    }
    else {
      console.log(elections.candidates.id(req.params.canid).vote_count);
      elections.candidates.id(req.params.canid).vote_count = elections.candidates.id(req.params.canid).vote_count + 1;
      elections.save();
      console.log(elections.candidates.id(req.params.canid).vote_count);

      res.json(true);

//       var candidates = elections.candidates;
//       console.log(elections.candidates);
//       res.json(candidates);
// //      var x = elections.find("_id" : "5ca09aec9b8fc81f2da6510b", "candidates._id" : "5ca09aec
    //  console.log(x);
    }

  })

});


app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
