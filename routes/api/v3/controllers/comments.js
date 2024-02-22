import express from 'express';
import moment from 'moment';
import getURLPreview from '../utils/urlPreviews.js';

var router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const postID = req.query.postID;
        const comments = await req.models.Comment.find({ post: postID });

        res.json(comments);
    } catch {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
})

router.post('/', async(req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            const newComment = new req.models.Comment({
                username: req.session.account.username,
                comment: req.body.newComment,
                post: req.body.postID,
                created_date: moment().toDate()
            })

            await newComment.save();
            return res.json({ status: "success"});
        } catch {
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

export default router;
