import express from 'express';
import fetch from 'node-fetch'
import parser from 'node-html-parser'
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/urls/preview', async (req, res, next) => {
    let inputUrl = req.query.url;
    console.log(inputUrl);
    
    try {
        let response = await fetch(inputUrl);
        let pageText = await response.text();
        //console.log(pageText);
        let htmlPage = parser.parse(pageText);

        let metaTags = htmlPage.querySelectorAll("meta ");
        //console.log("meta tags: " + metaTags);

        let metaUrl = htmlPage.querySelector("[property~=og:url[content]").content;
        let metaTitle = htmlPage.querySelector("[property~=og:title[content]").content;
        let metaImage = htmlPage.querySelector("[property~=og:img").content;
        let metaDescrip = htmlPage.querySelector("[property~=og:description").content;

        console.log(metaUrl + "");

        //document.head.querySelector("[property~=video][content]").content;

        // for (let i = 0; i < metaTags.length; i++) {
        //     let metaTag = metaTags[i];

        //     if (metaTag.contains)

        // }


    } catch (error) {
        console.log(error);
    }

});

export default router;