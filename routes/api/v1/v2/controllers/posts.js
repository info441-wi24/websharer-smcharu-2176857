import express from 'express';
import {promises as fs} from 'fs'
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async(req, res, next) => {
    try {
        const newPost = new req.models.Post({
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
});

export default router;
