import express from 'express';
import moment from 'moment';
import getURLPreview from '../utils/urlPreviews.js';

var router = express.Router();

//TODO: Add handlers here
router.get('/', async(req, res, next) => {
    let query = {};
    if (req.query.username) {
        query.username = req.query.username;
    }
    let posts = await req.models.Post.find(query)
    let postsJson = await Promise.all(
        posts.map(async (post) => { 
            try {
                // TODO: some await call
                let previewHTML = await getURLPreview(post.url);
                
                // return the info about post
                return ({ 
                    id: post._id,
                    user: post.user, 
                    description: post.description,
                    htmlPreview: previewHTML, 
                    username: post.username, 
                    url: post.url, 
                    likes: post.likes, 
                    created_date: req.body.created_date
                });
            } catch(error){
                console.log("Error getting posts from db", error)
                res.send(500).json({"status": "error", "error": error})
            }
        })
    );
    console.log(postsJson);
    res.json(postsJson);
})

router.post('/', async(req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const newPost = new req.models.Post({
                user: req.body.user,
                username: req.session.account.username,
                url: req.body.url,
                description: req.body.description,
                created_date: req.body.created_date
            })
    
            await newPost.save()
            res.json({status : "success"});
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', error: error.message });
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
         })
    }
});

router.post('/like', async(req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const postID = req.body.postID;
            const post = await req.models.Post.findById(postID);
            if (!post.likes.includes(req.session.account.username)) {
                post.likes.push(req.session.account.username);
                await post.save();
                return res.json({ status: "success"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                error: error.message
            })
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }
})

// idt this is working, cant unlike on website
router.post('/unlike', async(req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const postID = req.body.postID;
            const post = await req.models.Post.findById(postID);
            if (post.likes.includes(req.session.account.username)) {
                post.likes = post.likes.filter(item => item !== req.session.account.username);
                await post.save();
                return res.json({ status: "success"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                error: error.message
            })
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }
})

router.delete('/', async(req, res, next) => {
    if (req.session.isAuthenticated) {
        const postID = req.body.postID;
        const post = await req.models.Post.findById(postID);
        if (req.session.account.username != post.username) {
            res.status(401).json({
                status: "error",
                error: "you can only delete your own posts"
            })
        } else {
            try {
                // Delete all the comments that refer to the Post with the given postID (see the Mongoose "deleteMany" function)
                await req.models.Comment.deleteMany({post: postID});

                // Delete the Post referred to with the given postID (see the Mongoose "deleteOne" function).
                await post.deleteOne();
                return res.json({ status: "success"});
            } catch {
                console.log(error);
                res.status(500).json({
                    status: "error",
                    error: error.message
                })
            }
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }
})

export default router;
