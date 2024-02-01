import express from 'express';
import getURLPreview from '../utils/urlPreviews.js';

const router = express.Router();

// Handler for "api/v2/urls/preview"
router.get('/preview', async (req, res) => {

    try {
        const inputUrl = req.query.url;
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
