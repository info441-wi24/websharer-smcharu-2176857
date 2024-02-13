import mongoose from 'mongoose';

let models = {};

console.log("connecting to mongodb");

//TODO: add your mongoDB connection string below, with database names websharer
await mongoose.connect("mongodb+srv://smcharu:Password123@cluster0saimanasvi.l0aadyj.mongodb.net/websharer");

console.log("successfully connected to mongodb");

const postSchema = new mongoose.Schema({
    username: String,
    url: String,
    description: String,
    created_date: String
})

models.Post = mongoose.model('Post', postSchema);

console.log("mongoose models created")

export default models;