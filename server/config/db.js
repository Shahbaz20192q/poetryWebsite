const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/poetryWebsite');
        // const conn = await mongoose.connect('mongodb+srv://shahbazghaffar00:Shahbaz1920@cluster0.fj6qs96.mongodb.net/');
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;