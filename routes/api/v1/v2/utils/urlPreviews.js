import fetch from 'node-fetch';

import parser from 'node-html-parser';

async function getURLPreview(url){
    
    try {
        let response = await fetch(url);
        let pageText = await response.text();
        
        let htmlPage = parser.parse(pageText);

        let meta_title = htmlPage.querySelector('meta[property="og:title"]')?.getAttribute('content');
        let meta_url = htmlPage.querySelector('meta[property="og:url"]')?.getAttribute('content');
        let meta_image = htmlPage.querySelector('meta[property="og:image"]')?.getAttribute('content');
        let meta_descrip = htmlPage.querySelector('meta[property="og:description"]')?.getAttribute('content');
        
        // creative component
        let meta_author = htmlPage.querySelector('meta[name="author"]')?.getAttribute('content');


        if (meta_url == null) {
            meta_url = url;
        }

        if (meta_title == null) {
            meta_title = htmlPage.querySelector('title')?.text;
            if (meta_title == null) {
                meta_title = url;
            }
        }

        if (meta_descrip == null) {
            meta_descrip = htmlPage.querySelector('meta[name="description"]')?.getAttribute('content');;
        }

        function metaTitleFunction (meta_title) {
            if (meta_title) {
                return `<p><strong>${meta_title}</strong></p>`;
            } else {                
                return "";
            }
        }

        function metaImageFunction (meta_image) {
            if (meta_image) {
                return `<img src='${meta_image}' style='max-height: 200px; max-width: 270px;' ></img>`
            } else {
                return "";
            }
        }

        function metaDescripFunction (meta_descrip) {
            if (meta_descrip) {
                return `<p>${meta_descrip}</p>`
            } else {
                return "";
            }
        }

        function metaAuthorFunction (meta_author) {
            if (meta_author) {
                return `<p>${meta_author}</p>`
            } else {
                return "";
            }
        }

        let html1 = 
        `
            <html>
            <body>
                <div style="max-width: 300px; border: solid 1px; padding: 15px; text-align: center; background-color: #f0f0f0;"> 
                    <a href=${meta_url}>
                        ${metaTitleFunction(meta_title)}
                        ${metaAuthorFunction(meta_author)}
                        ${metaImageFunction(meta_image)}
                    </a>
                    ${metaDescripFunction(meta_descrip)}
                </div>
            <body>
            </html>
        `
        return(html1);

        console.log(html1);

    } catch (error) {
        console.log(error);
    }
}

export default getURLPreview;