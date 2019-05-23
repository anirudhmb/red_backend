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


//get electionlist based on constituency
router.route('/list/:constituency').get(function(req, res){
  console.log(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  console.log(new Date().toISOString());
  election.find({constituency:req.params.constituency,start_time:{"$lte":new Date().toLocaleString({timeZone: "Asia/Kolkata"})},end_time:{"$gt":new Date().toLocaleString({timeZone: "Asia/Kolkata"})}},function(err, docs){
    if(err){
      return res.status(400).send(err);
    }
    if(docs){
      console.log(docs);
      return res.status(200).json(docs);
    } else {
      return res.status(404).send("---");
    }
  });
});


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


//to add candidates to an election
router.route('/nomination').post(function(req,res){
  //election_id present in -> election_id
  //candidate details should be sent in a json format with the body name as candidate
  election.findByIdAndUpdate(
    req.body.election_id,
    {$push:{candidates:req.body.candidate}},
    (err, doc) => {
      if (err) {
          console.log("Something wrong when adding candidate!");
          return res.status(400).send("could not add candidate.");
      }

      console.log(doc);
      res.send("successfull");
    }
  );
});




app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
