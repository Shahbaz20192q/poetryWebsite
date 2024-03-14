const mongoose = require('mongoose');

const dailyCommentSchema = mongoose.Schema({
    comment: { type: String, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    poetry: [{ type: mongoose.Schema.Types.ObjectId, ref: "Write" }],
    createAT: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('DailyComments', dailyCommentSchema);