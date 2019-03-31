const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let election = new Schema({
    election_name: {
        type: String
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    },
    constituency: {
        type: String
    },
    result: {
        type: String,
        default: "--"
    },
    candidates: {
        name: {
            type: String
        },
        party_name: {
            type: String
        },
        party_symbol: {
            type: String
        },
        vote_count: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('election', election);