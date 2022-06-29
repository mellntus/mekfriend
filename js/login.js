import { 
    app,
    database,
    auth,
    ref,
    set,
    onValue,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
   } from "./config.js";   


    // Button
    let btnLogin = document.getElementById("btnLogin");
    let btnSignUp = document.getElementById("btnRegister");
    
    if(btnLogin){
        btnLogin.addEventListener("click", login);
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
                    alert("Data Inserted");
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

    if(btnSignUp){
        btnSignUp.addEventListener("click", register);
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


