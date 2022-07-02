import{
    auth,
    database,
    onValue,
    remove,
    push,
    query,
    orderByChild,
    orderByValue,
    ref,
    set
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

// test

let btnCheckPost = document.getElementById("btn-check-post");

if(btnCheckPost){
    btnCheckPost.addEventListener("click", showPostData);
}
// 

if(btnLogout){
    btnLogout.addEventListener("click", logout);
    console.log("I got clicked");
}if(btnCreatePost){
    btnCreatePost.addEventListener("click", createNewPost);
}

showPostData();

// Add Comment
// function addComment(){
//     let inputComment = document.getElementById("comment-input").value;
//     let userSession = auth.currentUser;
//     let postId = "1656656013383";
//     let postRef = ref(database, 'posts/');

//     let dt = new Date();
    
//     set(ref(database, 'posts/' + postId + '/comment/' + dt.getTime()),{
//         user_id : userSession.uid,
//         comment_content : inputComment

//     }).then( () =>{
//         alert("Data Inserted");
//     }).catch((error) => {
//         alert("Data not Inserted" + error.message);
//     });
// }

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


        addRecentPost();
    }
}

// Show Post Data
function showPostData(){
    let postRef = ref(database, 'posts/');
    onValue(postRef, (snapshot) => {
        let dataPost = snapshot.val();
        for(let i in dataPost){
            // console.log(dataPost[i]["userId"]);
            let likeRef = ref(database, "posts/" + i + "/like");
            onValue(likeRef, (likeSnapshot) => {
                let likeCount = likeSnapshot.size;
                let userProfileRef = ref(database, "users/" + dataPost[i]["userId"] + "/profile");
                onValue(userProfileRef, (userProfileRefs) => {
                    let userName = userProfileRefs.val().username;
                    document.querySelector(".recent-post-section").innerHTML += `
                        <form action="">
                            <div class="recent-post">
                                <input type="text" class="recent-post-uid" id="recent-post-uid" value='${i}' hidden>
                                <input type="text" class="recent-post-id" id="recent-post-id" value='${dataPost[i]["id"]}' hidden>
                                <input type="text" class="recent-userpost-id" id="recent-userpost-id" value='${dataPost[i]["userId"]}' hidden>
                                <div class="recent-header">
                                    <div class="d-flex" id="recent-post-header">
                                        <img src="image/miru_4.png" id="other-user-image" alt="" width="40px" height="50px">
                                        <div class="recent-profile">
                                            <h6 class="other-user-name">${userName}</h6>
                                            <h6 class="text-muted" id="recent-post-date">${dataPost[i]["post_date"]}</h6>
                                        </div>
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
                                <div class="comment-section">
                                    <div class="d-flex form-create-comment">
                                        <img src="image/miru_4.png" class="user-image" id="user-image" alt="" width="40px" height="50px">
                                        <div class="comment-post d-flex">
                                            <textarea name="create-post-comment" id="create-post-comment" class="create-post-comment" placeholder="Put your comment here" style="margin-right: 10px; max-height:82px" required></textarea>
                                            <div class="d-block">
                                                <button type="button" class="btn-comment" id="btn-comment-${dataPost[i]["id"]}" style="height: fit-content; width:100%; margin-bottom:3px;">Send</button>
                                                <button type="button" class="btnShowComment" id="btnShowComment-${dataPost[i]["id"]}" style="font-size:medium; width:100%" data-bs-toggle="modal" data-bs-target="#exampleModalComment">Show Comment</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <!-- Modal Show Comment Post -->
                            <div class="modal fade" id="exampleModalComment" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-scrollable">
                                    <div class="modal-content">

                                        <!-- Modal Header -->
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Show Comment</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        
                                        <!-- Modal Body -->
                                        <div class="modal-body" style="max-height:70vh">
                                        
                                            <!-- Modal Post Content -->
                                            <div>
                                                <div class="d-flex" id="recent-post-header">
                                                    <img src="image/miru_4.png" id="user-image" class="user-image" alt="" width="40px" height="50px" style="padding=0px">
                                                    <div class="recent-profile">
                                                        <h6 class="user-name" id="user-name">Erlangga</h6>
                                                        <h6 class="text-muted" id="create-post-date" class="create-post-date">16 September 2022</h6>
                                                    </div>
                                                </div>
                                                <p id="recent-showpost-content">${dataPost[i]["post_content"]}</p>
                                                <hr style="margin: 0px;">
                                                <div class="recent-bottom">
                                                    <div class="row">
                                                        <div role='button' class="left-sub col d-flex btn-showcomment-like" id='btn-like-${dataPost[i]["id"]}'>
                                                            <span class="material-icons">thumb_up</span>
                                                            <h6> Like</h6>
                                                        </div>
                                                        <div class="mid-sub col d-flex btn-cmd" id='btn-showcomment-cmd-${dataPost[i]["id"]}' >
                                                            <span class="material-icons">comment</span>
                                                            <h6> Comment</h6>
                                                        </div>
                                                        <div class="right-sub col d-flex btn-share" id='btn-showcomment-share-${dataPost[i]["id"]}' >
                                                            <span class="material-icons">share</span>
                                                            <h6> Share</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- End Modal Post Content -->

                                            <hr style="margin: 0;">

                                            <!-- List Comment -->
                                            <div class="list-recent-comment">

                                                <!-- INSERT LIST COMMENT HERE -->
                                                <div class="recent-comment my-2" style="background-color: #f3f3f3; padding: 5px 10px; border-radius: 10px">
                                                    <div class="header-comment">
                                                        <div class="d-flex">
                                                            <img src="image/miru_4.png" id="user-image" class="user-image" alt="" width="40px" height="50px" style="padding=0px">
                                                            <div class="d-block" style="align-self: center; margin:0px 5px">
                                                                <h6 style="margin: 0;">Erlangga AH</h6>
                                                                <h6 class="text-muted" style="margin: 0;">16 January 2002</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="main-comment">
                                                        <p>Hello world</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- End List Comment -->

                                        </div>
                                        <!-- End Modal Body -->

                                            <!-- Modal Footer -->
                                            <div class="modal-footer p-0">
                                                <div class="d-flex form-create-comment" style="width:-webkit-fill-available">
                                                    <img src="image/miru_4.png" class="user-image" id="user-image" alt="" width="40px" height="50px">
                                                    <div class="comment-post d-flex">
                                                        <textarea name="create-showpost-comment" id="create-showpost-comment-${dataPost[i]["id"]}" class="create-post-comment" placeholder="Put your comment here" style="margin-right: 10px; max-height:82px" required></textarea>
                                                        <div class="d-block">
                                                            <button type="button" class="btn-comment-show" id="btn-comment-show-${dataPost[i]["id"]}" style="height: fit-content; width:100%; margin-bottom:3px;">Send</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- End Modal Footer -->

                                    </div>
                                </div>
                            </div>
                        </form>
                        `

                        // Input
                        let divRecentPost = document.getElementsByClassName("recent-post");
                        
                        // Button
                        let btnAddLike = document.getElementsByClassName("btn-like");
                        let btnAddComment = document.getElementsByClassName("btn-comment");
                        let btnShowComment = document.getElementsByClassName("btnShowComment")
                        
                        for(let k = 0; k < divRecentPost.length; k++){
                            if(btnAddLike[k]){
                                btnAddLike[k].addEventListener("click", function(){
                                    // erase();
                                    let divRecentPostUID = document.getElementsByClassName("recent-post-uid")[k].value;
                                    let divRecentPostID = document.getElementsByClassName("recent-post-id")[k].value;
                                    let userSession = auth.currentUser;
                                    let postId = ref(database, "posts/" + divRecentPostUID + "/id");

                                    onValue(postId, (snapshot) => {
                                        if(snapshot.val() == divRecentPostID){
                                            set(ref(database, "posts/" + divRecentPostUID + "/like/" + uuidv4()), {
                                                user_id : userSession.uid
                                            }).then(() => {
                                                alert("data Inserted");
                                                location.reload();
                                            });
                                        }
                                        else{
                                            alert("No Like");
                                            console.log(divRecentPostID);
                                            console.log(snapshot.val());
                                            // Delete Like
                                            // remove(ref(database, "posts/" + i + "/like"), 
                                            // orderByValue(userSession.uid)).then(() => {
                                            //     alert("data updated");
                                            //     location.reload();
                                            // });
                                        }
                                        
                                    });
                                });
                            }
                            if(btnAddComment[k]){
                                btnAddComment[k].addEventListener("click", function(){
                                    // let inputComment = document.getElementById("create-post-comment" + dataPost[i]["id"]).value;
                                    let divRecentPostUID = document.getElementsByClassName("recent-post-uid")[k].value;
                                    let divRecentPostID = document.getElementsByClassName("recent-post-id")[k].value;
                                    let inputComment = document.getElementsByClassName("create-post-comment")[k].value;
                                    if(!inputComment){
                                        alert("data not accepted");
                                        return;
                                    }else{
                                        let userSession = auth.currentUser;
                                        let postId = ref(database, "posts/" + divRecentPostUID + "/id");

                                        onValue(postId, (snapshot) => {
                                            if(snapshot.val() == divRecentPostID){
                                                let dt = new Date();
                                        
                                                set(ref(database, 'posts/' + divRecentPostUID + '/comment/' + dt.getTime()),{
                                                    user_id : userSession.uid,
                                                    comment_content : inputComment
                                            
                                                }).then( () =>{
                                                    alert("Data Inserted");
                                                    location.reload();
                                                }).catch((error) => {
                                                    alert("Data not Inserted" + error.message);
                                                });
                                            }
                                            else{
                                                alert("data not inserted");
                                                return;
                                            }
                                        });
    
                                        
                                    }
                                });
                            }
                            if(btnShowComment[k]){
                                btnShowComment[k].addEventListener("click", function(){
                                    console.log("Hello World");
                                });
                            }
                        }
                });
            });
        }
    });
}

function showPostComment(){

}



