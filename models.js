import mongoose from 'mongoose';

let models = {};

console.log("connecting to mongodb");

//TODO: add your mongoDB connection string below, with database names websharer
await mongoose.connect("mongodb+srv://smcharu:Password123@cluster0saimanasvi.l0aadyj.mongodb.net/websharer");

console.log("successfully connected to mongodb");

const postSchema = new mongoose.Schema({
    user: String,
    username: String,
    url: String,
    description: String,
    likes: { type: [String], default: [] },
    created_date: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: mongoose.Schema.Types.ObjectId, 
    created_date: { type: Date, default: Date.now }
});

models.Post = mongoose.model('Post', postSchema);

models.Comment = mongoose.model('Comment', commentSchema);

console.log("mongoose models created")

export default models;