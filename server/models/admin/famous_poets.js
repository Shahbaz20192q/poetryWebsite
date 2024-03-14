const mongoose = require('mongoose');

const Famous_poet = mongoose.Schema({
    poetName: { type: String, required: true, unique: true },
    poetImage: { type: String, required: true },
    poetDiscription: { type: String, required: true },
});

module.exports = mongoose.model('famous_poet', Famous_poet);