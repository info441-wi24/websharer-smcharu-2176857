import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('/preview', function(req, res, next) {
    const inputUrl = req.query.url;

    try {
        const previewHTML = await getURLPreview(inputUrl);

        res.type("html");
        res.send(previewHTML);

        console.log(previewHTML);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
    }
});

export default router;