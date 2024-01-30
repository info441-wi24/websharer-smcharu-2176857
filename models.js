const mongoose = require('mongoose');

let models = {};

console.log("connecting to mongodb");

//TODO: add your mongoDB connection string below, with database names websharer
await mongoose.connect("mongodb://localhost:27017/websharer");

console.log("successfully connected to mongodb");

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: String
})

models.User = mongoose.model('Post', postSchema);

export default models;