const mongoose = require('mongoose');

const writePoetrySchema = mongoose.Schema({
    poetName: { type: String, required: true },
    poetry: { type: String, required: true },
    userName: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
});

module.exports = mongoose.model('Write', writePoetrySchema);