import{
    auth,
    database,
    onValue,
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
    
    // Button
    let btnLogout = document.getElementById("btnLogout");
    let btnCreatePost = document.getElementById("btnCreatePost");
    let btnAddLike = document.getElementById("btn-like");
    
    // test
    let btnCheckLike = document.getElementById("btn-check-like");

    if(btnCheckLike){
        btnCheckLike.addEventListener("click", checkLike);
    }
    // 

    if(btnLogout){
        btnLogout.addEventListener("click", logout);
        console.log("I got clicked");
    }if(btnCreatePost){
        btnCreatePost.addEventListener("click", createNewPost);
    }if(btnAddLike){
        btnAddLike.addEventListener("click", addLike);
    }

    // Test Add Like
    function addLike(){

        let userSession = auth.currentUser;
        let postId = "b0f0747f-ff37-478b-b25a-b07dfe80b77c";

        push(ref(database, 'users/' + userSession.uid + '/post/' + postId + '/like'),{
            like : userSession.uid
    
        }).then( () =>{
            alert("Data Updated");
        }).catch((error) => {
            alert("Data not Inserted" + error.message);
        });

        push(ref(database, 'posts/' + postId + '/like'),{
            like : userSession.uid
    
        }).then( () =>{
            alert("Data Inserted");
        }).catch((error) => {
            alert("Data not Inserted" + error.message);
        });

    }

    function checkLike(){
        let userSession = auth.currentUser;
        let postId = "b0f0747f-ff37-478b-b25a-b07dfe80b77c";
        let postRef = ref(database, 'posts/');
        let userRef = ref(database, 'users/' + userSession.uid + "/post");
        // let postRef = query(ref(database, 'posts/'), orderByChild("image"));
        // let userRef = ref(database, 'users/');

        onValue(postRef, (snapshot) => {
            let dataPost = snapshot.val();
            const countPost = snapshot.size;
            console.log(dataPost);

            for(let i in dataPost){
                console.log(dataPost[i]["like"]);
                let likeRef = ref(database, "posts/" + i + "/like");
                onValue(likeRef, (likeData) => {
                    let dataLike = likeData.val();
                    for(let j in dataLike){
                        console.log(dataLike[j]["like"]);
                        
                    }
                });
            }
            
        });
        
        onValue(userRef, (snapshot) => {
            const dataUser = snapshot.size;
            console.log(dataUser);
        });
    }

    // Test Create Post

    function createNewPost(){
        let inputText = document.getElementById("create-post-content").value;

        if(!inputText){
            alert("PLease Complete form");
            return;
        }else{
            let userSession = auth.currentUser;
            const postId = uuidv4();
            const userpostId = postId;

            let dt = new Date();

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
                        image: "image here",
                        post_date: dt,
                        post_content: inputText,
                        like:""
                
                    }).then( () =>{
                        alert("Data Inserted");
                    }).catch((error) => {
                        alert("Data not Inserted" + error.message);
                    });

                    // Set Data to Posts
                    set(ref(database, "posts/" + postId),{
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
        // addRecentPost;
    }
    
    function addRecentPost(userId, postId, userImage ,userName, userPostDate, postContent, postLike){
    
        // Add Header Div
        let divRecentPost = document.createElement("div");
        divRecentPost.className = "recent-post";
    
            // Element Inside Div
            // Sub Div 1
            let divRecentHeader = document.createElement("div");
            divRecentHeader.className = "recent-header";
    
                // Sub Div 2
                let divDFlex = document.createElement("div");
                divDFlex.className = "d-flex";
                divDFlex.id = "create-post-header";
    
                    // IMG
                    // Other User Image
                    let imgOtherUser = document.createElement("img");
                    imgOtherUser.id = "other-user-image"
                    imgOtherUser.src = "/image/miru_4.png";
                    imgOtherUser.style = "width:40px; height:50px"
    
                    // Sub Div 3
                    let divRecentProfile = document.createElement("div");
                    divRecentProfile.className = "recent-profile";
    
                        // H6 - 1
                        let h1 = document.createElement("h6");
                        h1.id = "other-user-name";
                        h1.innerHTML = "Alroy Hery";
    
                        // H6 - 2
                        let h2 = document.createElement("h6");
                        h2.className = "text-muted";
                        h2.id = "recent-post-date";
                        h2.innerHTML = "16 September 2022";
    
                        divRecentProfile.appendChild(h1);
                        divRecentProfile.appendChild(h2);
                
                divDFlex.appendChild(imgOtherUser);
                divDFlex.appendChild(divRecentProfile);
            
            divRecentHeader.appendChild(divDFlex);
    
            // Add Main Div
            let divRecentMain = document.createElement("div");
            divRecentMain.className = "recent-main";
    
                let divContainer = document.createElement("div");
                divContainer.className = "container";
    
                    let pRecentPostContent = document.createElement("p");
                    pRecentPostContent.id = "recent-post-content";
                    pRecentPostContent.innerHTML = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime dolorum alias quam delectus eaque voluptatibus totam laboriosam facilis, eligendi laborum!"; 
    
                    let divLikeCount = document.createElement("div");
                    divLikeCount.className = "like-count";
    
                        let pLikeCount = document.createElement("p");
                        pLikeCount.className = "text-muted";
                        pLikeCount.id = `
                            16 orang menyukai ini <span class="material-icons" style="font-size: small;">thumb_up</span>
                        `;
    
                        divLikeCount.appendChild(pLikeCount);
    
                divContainer.appendChild(pRecentPostContent);
                divContainer.appendChild(divLikeCount);
            
            divRecentMain.appendChild(divContainer);
            
            // Add Bottom Div
            let hr = document.createElement("hr");
            hr.className = "solid";
    
            let divRecentBottom = document.createElement("div");
            divRecentBottom.className = "recent-bottom";
    
                // Sub Div
                let divBottomRow = document.createElement("div");
                divBottomRow.className = "row";
    
                    // Sub Sub Div 1
                    let divLeftSub = document.createElement("div");
                    divLeftSub.className = "left-sub col d-flex";
                    divLeftSub.id = "btn-like";
                    divLeftSub.innerHTML = `<span class="material-icons">thumb_up</span>`;
    
                        let hLike = document.createElement("h6");
                        hLike.innerHTML = " Like";
    
                    divLeftSub.appendChild(hLike);
    
                    // Sub Sub Div 2
                    let divMidSub = document.createElement("div");
                    divMidSub.className = "mid-sub col d-flex";
                    divMidSub.id = "btn-cmd";
                    divMidSub.innerHTML = `<span class="material-icons">comment</span>`;
    
                        let hComment = document.createElement("h6");
                        hComment.innerHTML = " Comment";
    
                    divMidSub.appendChild(hComment);
                    
                    // Sub Sub Div 3
                    let divRightSub = document.createElement("div");
                    divRightSub.className = "right-sub col d-flex";
                    divRightSub.id = "btn-share";
                    divRightSub.innerHTML = `<span class="material-icons">share</span>`;
    
                        let hShare = document.createElement("h6");
                        hShare.innerHTML = " Comment";
    
                    divRightSub.appendChild(hShare);
    
                divBottomRow.appendChild(divLeftSub);
                divBottomRow.appendChild(divMidSub);
                divBottomRow.appendChild(divRightSub);
            
            divRecentBottom.appendChild(divBottomRow);
    
            // Add Comment Section
            let divCommentSection = document.createElement("div");
            divCommentSection.className = "comment-section";
    
                let formCreateComment = document.createElement("form");
                    let divFormCreateComment = document.createElement("div");
                    divFormCreateComment.id = "form-create-element";
    
                        // IMG USER
                        let imgUser = document.createElement("img");
                        imgUser.id = "user-image";
                        imgUser.style = "width:40px;height:50px";
    
                        let divCommentPost = document.createElement("div");
                        divCommentPost.className = "comment-post d-flex";
    
                            let txtComment = document.createElement("textarea");
                            txtComment.id = "comment-input";
                            txtComment.name = "comment-input";
                            txtComment.placeholder = "Put Your Comment Here";
                            txtComment.required = true;
    
                            let btnComment = document.createElement("button");
                            btnComment.type = "button";
                            btnComment.id = "btn-comment";
                            btnComment.innerHTML = " Send";
    
                        divCommentPost.appendChild(txtComment);
                        divCommentPost.appendChild(btnComment);
    
                    divFormCreateComment.appendChild(divCommentPost);
                formCreateComment.appendChild(divFormCreateComment);
            divCommentSection.appendChild(formCreateComment);
        
        divRecentPost.appendchild(divRecentHeader);
        divRecentPost.appendchild(divRecentMain);
        divRecentPost.appendchild(solid);
        divRecentPost.appendchild(divRecentBottom);
        divRecentPost.appendchild(divCommentSection);
    
        document.querySelector(".mid-content").appendChild(divRecentPost);
    }
    
    function showPostComment(){
    
    }
    
    function createNewPostComment(){
    
        addPostComment;
    }
    
    function addPostComment(userId, commentId, postId, userImage, userName, userPostCommentDate, commentContent){
    
    }



