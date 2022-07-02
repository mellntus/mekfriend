import { 
    database,
    auth,
    providerGoogle,
    GoogleAuthProvider,
    signInWithPopup,
    ref,
    push,
    set,
    onValue,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
   } from "./config.js";   

        // Button
        let btnLogin = document.getElementById("btnLogin");
        let btnSignUp = document.getElementById("btnRegister");
        let btnGoogle = document.getElementById("btnGoogle");

        if(btnSignUp){
            btnSignUp.addEventListener("click", register);
        }
        if(btnLogin){
            btnLogin.addEventListener("click", login);
        }
        if(btnGoogle){
            btnGoogle.addEventListener("click", loginGoogle);
        }

        // LOGIN
        function login(){
            let loginEmail = document.getElementById("loginEmail").value;
            let loginPassword = document.getElementById("loginPassword").value;

            signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;

                let directUser = ref(database, 'users/'+ user.uid + '/profile');
                onValue(directUser, (snapshot) => {
                const data = snapshot.val();
                alert("Login Success, Welcome "+ data["username"]);
                window.location = "http://127.0.0.1:5500/index.html";
                });
            
            })
            .catch((error) => {
                const errorMessage = error.message;

                console.log("Error" + errorMessage);
                alert("Email or Password not Correct");
            });
        };

        // REGISTER
        function register(){
            let registerUsername = document.getElementById("registerUsername").value;
            let registerEmail = document.getElementById("registerEmail").value;
            let registerPassword = document.getElementById("registerPassword").value;
            let registerPassword1 = document.getElementById("registerPassword1").value;
            let registerAlamat = document.getElementById("registerAlamat").value;

            if(!registerEmail || !registerPassword || !registerPassword1){
                alert("Please Complete the Form");
                return;
            }else{
                if(registerPassword == registerPassword1){
                    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
                    .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                
                    let dt = new Date();

                    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

                    let dd = String(dt.getDate());
                    let mm = month[dt.getMonth()];
                    let yyyy = dt.getFullYear();

                    dt = dd + ' ' + mm + ' ' + yyyy;
                
                        console.log(registerAlamat);
                        console.log(registerPassword);
                        console.log(registerUsername);
                        console.log(dt);

                    set(ref(database, 'users/' + user.uid + '/profile'),{
                        username: registerUsername,
                        email: user.email,
                        alamat: registerAlamat,
                        last_login: dt
                
                    }).then( () =>{
                        alert("Data Inserted, Welcome " + registerUsername);
                        window.location.href = "http://127.0.0.1:5500/index.html";
                    }).catch((error) => {
                        alert("Data not Inserted" + error.message);
                    });
                
                    // alert("SignUp Success" + registerUsername);

                    })
                    .catch((error) => {
                    console.log("error message" + error);
                    
                    });
                }else{
                    alert("Password doesnt match");
                    return;
                }
            } 
        }

        // Google Sign In
        function loginGoogle(){
            signInWithPopup(auth, providerGoogle)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                
                let userGoogle = auth.currentUser;

                let dt = new Date();

                const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

                let dd = String(dt.getDate());
                let mm = month[dt.getMonth()];
                let yyyy = dt.getFullYear();

                dt = dd + ' ' + mm + ' ' + yyyy;

                // const postData = {
                //     last_login: dt,
                // }

                // const newProfileKey = push(child(ref(database), 'users/' + userGoogle.uid + '/profile')).key;

                // const updateUser = {};

                // updateUser[newProfileKey] = postData;

                // return updateUser(ref(database), updates);
                
                push(ref(database, 'users/' + userGoogle.uid + '/profile'),{
                    last_login: dt,
                    alamat : ""
            
                }).then( () =>{
                    alert("Data Inserted, Welcome " + user.displayName);
                    window.location.href = "http://127.0.0.1:5500/index.html";
                }).catch((error) => {
                    alert("Data not Inserted" + error.message);
                });


            }).catch((error) => {
                alert("Login Error " + error.message);
            });
        }


function logout(){
    signOut(auth).then(() => {
        // Sign-out successful.
        alert("Sign-out successful...");
        window.location = "http://127.0.0.1:5500/login.html";
      }).catch((error) => {
        // An error happened.
        alert(error);
      });
}

export{
    logout
}


