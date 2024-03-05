async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');

    let linkedIn = document.getElementById("linkedInInput").value;
    if (!linkedIn) {
        return;
    }

    try {
        await fetchJSON(`api/${apiVersion}/usersInfo`, {
            method: "POST",
            body : {linkedIn: linkedIn, user : user}
        });
    } catch(error) {
        console.error("Error saving user information:", error);
    }

    document.getElementById('linkedInInput').value = "";

    loadUserInfo();
}



async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    console.log(username);
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    // TODO: do an ajax call to load whatever info you want about the user from the user table
    let userInfo = await fetchJSON(`api/${apiVersion}/usersInfo?username=${username}`)
    console.log(userInfo);
    let userinfodiv = document.getElementById("user_info_div")

    // let linkedInDiv = document.createElement('p')
    // linkedInDiv.value = username[0].linkedIn
    // userinfodiv.append(linkedInDiv)
    userinfodiv.innerHTML = `<p>LinkedIn: ${userInfo[0].linkedIn}</p>`

    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}