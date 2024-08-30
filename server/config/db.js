const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect('mongodb+srv://shahbazghaffar00:1zc5LFMJzAO8ftzN@cluster0.d7o40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        // const conn = await mongoose.connect('mongodb+srv://shahbazghaffar00:Shahbaz1920@cluster0.fj6qs96.mongodb.net/');
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;