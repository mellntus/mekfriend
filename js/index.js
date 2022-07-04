import{
    auth,
    database,
    onValue,
    remove,
    update,
    ref,
    set,
    updatePassword
} from "./config.js"

import{
    logout
} from "./login.js"

import{
    uuidv4
} from "./uuid.js"

// let midCol = document.getElementById("mid-col");
// function erase(){
//     midCol.innerHTML = '';
// }

// Button
let btnLogout = document.getElementById("btnLogout");
let btnCreatePost = document.getElementById("btnCreatePost");
let btnEditProfile = document.getElementById("btn-edit-profile");
let btnSaveProfile = document.getElementById("btnSaveProfile");
let btnChangePassword = document.getElementById("btnChangePassword");

// List Div
let divEdit = document.getElementById("get-profile-data");

if(btnEditProfile){
    btnEditProfile.addEventListener("click", editProfile);
}if(btnSaveProfile){
    btnSaveProfile.addEventListener("click", saveProfile);
}if(btnChangePassword){
    btnChangePassword.addEventListener("click", changePassword);
}if(btnLogout){
    btnLogout.addEventListener("click", logout);
    console.log("I got clicked");
}if(btnCreatePost){
    btnCreatePost.addEventListener("click", createNewPost);
}

showPostData();

// Create Post
function createNewPost(){
    let inputText = document.getElementById("create-post-content").value;

    if(!inputText){
        alert("Please Complete form");
        return;
    }else{
        let userSession = auth.currentUser;
        let dt = new Date();

        // const postId = uuidv4();
        const postId = dt.getTime(); 
        const userpostId = postId;

        const postUid = uuidv4();
        const userpostUid = postUid;

        // let postRef = ref(database, 'posts/');
        // let userRef = ref(database, 'users/' + userSession.uid + "/post");

        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        let dd = String(dt.getDate());
        let mm = month[dt.getMonth()];
        let yyyy = dt.getFullYear();

        dt = dd + ' ' + mm + ' ' + yyyy;
    
        console.log(userSession.uid);
        console.log(uuidv4());
        console.log("image here");
        console.log(userSession.displayName);
        console.log(dt);
        console.log(inputText);
        console.log("like here");

        // Set Data to User
        set(ref(database, 'users/' + userSession.uid + '/post/' + userpostId),{
            post_id : userpostUid
        }).then(() =>{
            alert("Data Inserted");
        }).catch((error) => {
            alert("Data not Inserted" + error.message);
        });

        // Set Data to Posts
        set(ref(database, "posts/" + postId),{
            id : postUid,
            userId: userSession.uid,
            image: "image here",
            post_date: dt,
            post_content: inputText,
            like:""
        }).then(() => {
            location.reload();
        }).catch((error) => {
            alert("Data not Inserted" + error.message)
        });

    }
}

// Edit Profile Div
function editProfile(){
    if(divEdit.style.display == "none"){
        divEdit.style.display = "block";
        getProfile();
    }else{
        divEdit.style.display = "none";
    }
}

// Save Profile
function saveProfile(){
    const userSession = auth.currentUser;

    // Form Input
    let editUsername = document.getElementById("editUsername").value;
    let editEmail = document.getElementById("editEmail").value;
    let editPassword = document.getElementById("editPassword").value;
    let editPassword1 = document.getElementById("editPassword1").value;
    let editAlamat = document.getElementById("editAlamat").value;

    // Validate Password
    if(editPassword != null){

        if(editPassword == editPassword1){
            updatePassword(userSession, editPassword).then(() => {

                console.log("Password Updated");
            }).catch((error) => {
                console.log(error);
                return;
            });
        }
    }else{
        console.log("No Password Changed");
    }

    if(!editUsername || !editAlamat){
        alert("Please Complete the Form");
        return;
    
    }else{
    const newData = {
        username : editUsername,
        alamat : editAlamat
    };

    update(ref(database, "users/" + userSession.uid + "/profile"), newData);
    location.reload();
    }
}

// Change User Password Input
function changePassword(){
    let inputPassword = document.getElementById("editPassword");
    let inputPassword1 = document.getElementById("editPassword1");
  
    if(inputPassword.hasAttribute("disabled") & inputPassword1.hasAttribute("disabled")){
      inputPassword.removeAttribute("disabled");
      inputPassword1.removeAttribute("disabled");
    }else{
      inputPassword.setAttribute("disabled", "");
      inputPassword1.setAttribute("disabled", "");
    }
}

// Get Profile Data
function getProfile(){
    const user = auth.currentUser;
    return onValue(ref(database, 'users/' + user.uid + "/profile"), (snapshot) => {
      document.getElementById("editUsername").value = snapshot.val()["username"];
      document.getElementById("editEmail").value = snapshot.val()["email"];
      document.getElementById("editAlamat").value = snapshot.val()["alamat"];
    });
  
}

// Show Post Data
function showPostData(){

    // Get All Post
    let postRef = ref(database, 'posts/');
    onValue(postRef, (snapshot) => {
        let dataPost = snapshot.val();
        for(let i in dataPost){

            // Get All Like 
            let likeRef = ref(database, "posts/" + i + "/like");
            onValue(likeRef, (likeSnapshot) => {
                let likeCount = likeSnapshot.size;

                // Get User Profile based on Post User
                let userProfileRef = ref(database, "users/" + dataPost[i]["userId"] + "/profile");
                onValue(userProfileRef, (userProfileRefs) => {
                    let userName = userProfileRefs.val().username;
                    document.querySelector(".recent-post-section").innerHTML += `
                        <form action="">
                            <div class="recent-post" style="word-break: break-word;">
                                <input type="text" class="recent-post-uid" id="recent-post-uid" value='${i}' hidden>
                                <input type="text" class="recent-post-id" id="recent-post-id" value='${dataPost[i]["id"]}' hidden>
                                <input type="text" class="recent-userpost-id" id="recent-userpost-id" value='${dataPost[i]["userId"]}' hidden>
                                <div class="recent-header">
                                    <div class="d-flex" id="recent-post-header" style="justify-content: space-between;">
                                        <div class="d-flex">
                                            <img src="image/miru_4.png" id="other-user-image" alt="" width="40px" height="50px">
                                            <div class="recent-profile">
                                                <h6 class="other-user-name">${userName}</h6>
                                                <h6 class="text-muted" id="recent-post-date">${dataPost[i]["post_date"]}</h6>
                                            </div>
                                        </div>
                                        <button type="button" class="btn-delete" id="btn-delete" style="align-self:center; height:fit-content"><span class="material-icons" style="vertical-align: bottom;">delete</span></button>
                                    </div>
                                </div>
                                <div class="recent-main">
                                    <div class="container">
                                        <p id="recent-post-content">${dataPost[i]["post_content"]}</p>
                                        <div class="div-like-count">
                                            <p class="text-muted like-count" id="like-count">${likeCount} orang menyukai ini <span class="material-icons" style="font-size: small;">thumb_up</span></p>
                                        </div>
                                    </div>
                                </div>
                                <hr class="solid">
                                <div class="recent-bottom">
                                    <div class="row">
                                        <div role='button' class="left-sub col d-flex btn-like" id='btn-like-${dataPost[i]["id"]}'>
                                            <span class="material-icons">thumb_up</span>
                                            <h6> Like</h6>
                                        </div>
                                        <div class="mid-sub col d-flex btn-cmd" id='btn-cmd-${dataPost[i]["id"]}' >
                                            <span class="material-icons">comment</span>
                                            <h6> Comment</h6>
                                        </div>
                                        <div class="right-sub col d-flex btn-share" id='btn-share-${dataPost[i]["id"]}' >
                                            <span class="material-icons">share</span>
                                            <h6> Share</h6>
                                        </div>
                                    </div>
                                </div>
                                <hr class="solid">
                                <div class="show-comment-section" id="show-comment-section" style="max-height: 30vh; overflow-y:scroll; display:none">

                                </div>
                                <hr class="solid">
                                <div class="comment-section">
                                    <div class="d-flex form-create-comment">
                                        <img src="image/miru_4.png" class="user-image" id="user-image" alt="" width="40px" height="50px">
                                        <div class="comment-post d-flex">
                                            <textarea name="create-post-comment" id="create-post-comment" class="create-post-comment" placeholder="Put your comment here" style="margin-right: 10px; max-height:82px; min-height:42px" required></textarea>
                                            <div class="d-block">
                                                <button type="button" class="btn-comment" id="btn-comment-${dataPost[i]["id"]}" style="height: fit-content; width:100%; margin-bottom:3px;">Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                        </form>
                    `

                    // Event Handler

                    // Div
                    let divRecentPost = document.getElementsByClassName("recent-post");
                    
                    // Button Recent Post no Module
                    let btnAddLike = document.getElementsByClassName("btn-like");
                    let btnAddComment = document.getElementsByClassName("btn-comment");
                    let btnShowComment = document.getElementsByClassName("btn-cmd");
                    let btnDelete = document.getElementsByClassName("btn-delete");
                    
                    for(let k = 0; k < divRecentPost.length; k++){

                        // Id Input
                        let divRecentPostUID = document.getElementsByClassName("recent-post-uid")[k].value;
                        let divRecentPostID = document.getElementsByClassName("recent-post-id")[k].value;
                        let userSession = auth.currentUser;

                        // ADD LIKE SECTION
                        if(btnAddLike[k]){
                            btnAddLike[k].addEventListener("click", function(){
                                
                                // Get All Post Data based on Post ID
                                let postId = ref(database, "posts/" + divRecentPostUID + "/id");

                                onValue(postId, (snapshot) => {
                                    if(snapshot.val() == divRecentPostID){

                                        // Add Like to Child
                                        set(ref(database, "posts/" + divRecentPostUID + "/like/" + uuidv4()), {
                                            user_id : userSession.uid
                                        }).then(() => {
                                            alert("Post Liked");
                                            location.reload();
                                        });
                                    }
                                    else{
                                        alert("No Like");
                                        return;
                                    }
                                    
                                });
                            });
                        }

                        // ADD COMMENT SECTION 
                        if(btnAddComment[k]){
                            btnAddComment[k].addEventListener("click", function(){
                                
                                // Input Post Comment
                                let inputComment = document.getElementsByClassName("create-post-comment")[k].value;
                                if(!inputComment){
                                    alert("Data not Accepted");
                                    return;
                                }else{
                                    let userSession = auth.currentUser;

                                    // Get All Post Data based on Post ID
                                    let postId = ref(database, "posts/" + divRecentPostUID + "/id");

                                    onValue(postId, (snapshot) => {
                                        if(snapshot.val() == divRecentPostID){
                                            let dt = new Date();
                                            let dy = new Date();

                                            const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

                                            let dd = String(dt.getDate());
                                            let mm = month[dt.getMonth()];
                                            let yyyy = dt.getFullYear();

                                            dy = dd + ' ' + mm + ' ' + yyyy;
                                    
                                            // 
                                            set(ref(database, 'posts/' + divRecentPostUID + '/comment/' + dt.getTime()),{
                                                user_id : userSession.uid,
                                                comment_content : inputComment,
                                                comment_date : dy
                                        
                                            }).then( () =>{
                                                alert("Data Inserted");
                                                location.reload();
                                            }).catch((error) => {
                                                alert("Data not Inserted" + error.message);
                                            });
                                        }
                                        else{
                                            alert("Data not Inserted");
                                            return;
                                        }
                                    });
                                }
                            });
                        }

                        // SHOW COMMENT MODAL SECTION
                        if(btnShowComment[k]){
                            btnShowComment[k].addEventListener("click", function(){

                                // Div
                                let showCommentSection = document.getElementsByClassName("show-comment-section")[k];

                                if(showCommentSection.style.display == "block"){
                                    showCommentSection.style.display = "none";
                                }else{
                                    showCommentSection.style.display = "block";
                                }

                                // Show Comment by Module Start Here
                                console.log("Hello World");
                                let commentId = ref(database, "posts/" + divRecentPostUID + "/comment");

                                onValue(commentId, (snapshot) => {
                                    let commentData = snapshot.val();

                                    for(let l in commentData){

                                        // Get Profile Data based on User Comment
                                        let userCommentDataRef = ref(database, "users/" + commentData[l]["user_id"] + "/profile");
                                        onValue(userCommentDataRef, (userCommentDataSnapshot) => {
                                            let commentUsername = userCommentDataSnapshot.val().username;
                                            showCommentSection.innerHTML += `
                                                <!-- INSERT LIST COMMENT HERE -->
                                                    <div class="recent-comment m-2" style="background-color: #f3f3f3; padding: 5px 10px; border-radius: 10px; overflow-wrap: break-word;">
                                                        <div class="header-comment">
                                                            <div class="d-flex">
                                                                <img src="image/miru_4.png" id="other-user-image" class="other-user-image" alt="" width="40px" height="50px" style="padding=0px">
                                                                <div class="d-block" style="align-self: center; margin:0px 5px">
                                                                    <h6 style="margin: 0;">${commentUsername}</h6>
                                                                    <h6 class="text-muted" style="margin: 0;">${commentData[l]["comment_date"]}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="main-comment">
                                                            <p>${commentData[l]["comment_content"]}</p>
                                                        </div>
                                                    </div>
                                                <!-- END -->
                                            `
                                        });
                                    }
                                });

                            });
                        }

                        // DELETE POST
                        if(btnDelete[k]){
                            btnDelete[k].addEventListener("click", function(){
                                console.log("Hello World");

                                let getCurrentUserPost = ref(database, "users/" + userSession.uid + "/post");

                                onValue(getCurrentUserPost, (getPostSnapshot) => {
                                    
                                    let getPostData = getPostSnapshot.val();
                                    for(let n in getPostData){
                                        if(getPostData[n]["post_id"] != divRecentPostID){
                                            alert("You cant delete other user post");
                                            return;
                                        }else{
                                            remove(ref(database, "posts/" + divRecentPostUID))
                                            .catch((error) => {
                                                alert("Data not Deleted " + error.message);
                                            });
    
                                            remove(ref(database, "users/" + userSession.uid + "/post/" + divRecentPostUID))
                                            .then(() => {
                                                alert("Post Removed Successfully");
                                                location.reload();
                                            }).catch((error) => {
                                                alert("Data not Deleted " + error.message);
                                            });
                                        }
                                    }

                                });
                            });
                        }
                    }
                });
            });
        }
    });
}

