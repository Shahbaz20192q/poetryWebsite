const mongoose = require('mongoose');

const poetrySchema = mongoose.Schema({
    poetName: { type: String, required: true },
    poetNameKeyword: { type: String, required: true },
    category: { type: String, required: true },
    nazamTitle: { type: String, unique: true },
    poetry: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyComments' }],
    createAT: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('poetry', poetrySchema);