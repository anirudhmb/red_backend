const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    name: {
        type: String
    },
    email_id: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    adhaar_card_number: {
        type: String
    },
    voter_id: {
        type: String
    },
    device_id: {
        type: String
    },
    constituency: {
        type: String
    }
});

module.exports = mongoose.model('user', user);