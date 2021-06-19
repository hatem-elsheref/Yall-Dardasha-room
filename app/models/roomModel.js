const mongooseConnection = require('../mongoConnection')

const Schema = mongooseConnection.Schema;

const Room = new Schema({
    name: { type: String, required: false },
    audience: { type: Array, required: true },
    speakers: {type: Array, required:  true},
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
    available: { type: Boolean, required: true },
});

module.exports = mongooseConnection.model('Room', Room);
