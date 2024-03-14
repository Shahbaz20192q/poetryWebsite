const mongoose = require('mongoose');

const dailyPoetrySchema = mongoose.Schema({
    poetName: { type: String, required: true },
    poetry: { type: String, required: true },
    userName: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyComments'}],
});

module.exports = mongoose.model('Daily_poetry', dailyPoetrySchema);