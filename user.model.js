const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

let user = new Schema({
    name: {
        type: String
    },
    email_id: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role :{
        type : String,
        required : true
    },
    age: {
        type: Number
    },
    adhaar_card_number: {
        type: String,
        required: true,
        unique:true
    },
    voter_id: {
        type: String,
        unique:true
    },
    device_id: {
        type: String,
        unique:true
    },
    constituency: {
        type: String
    }
});

user.plugin(uniqueValidator, {message: 'is already taken.'});

module.exports = mongoose.model('user', user);
