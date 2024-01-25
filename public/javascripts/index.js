async function previewUrl() {
    let url = document.getElementById("urlInput").value;

    try {
        let response = await fetch("api/v1/urls/preview?url=" + url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let preview = await response.text();
        displayPreviews(preview);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayPreviews(previewHTML) {
    document.getElementById("url_previews").innerHTML = previewHTML;
}
