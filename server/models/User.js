const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Write' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);