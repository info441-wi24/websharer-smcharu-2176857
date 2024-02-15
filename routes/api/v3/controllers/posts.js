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
                return ({ user: post.user, description: post.description,
                    htmlPreview: previewHTML, username: post.username });
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
                created_date: moment().format('MMMM Do YYYY, h:mm:ss a')
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

export default router;
