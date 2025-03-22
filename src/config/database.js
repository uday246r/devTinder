const mongoose = require('mongoose');

const connectDB = async() => {
 await mongoose.connect(
    "mongodb+srv://udayofficial246:uday246U@devtinder.a7ur0.mongodb.net/devTinder"
 );
};

module.exports = connectDB;
