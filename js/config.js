import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, update, set, onValue } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updatePassword,
  GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhAkQzK0qIsW0aUjSrtMyKv0Grd-GAfU8",
  authDomain: "mekfriend.firebaseapp.com",
  databaseURL: "https://mekfriend-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "mekfriend",
  storageBucket: "mekfriend.appspot.com",
  messagingSenderId: "950693853680",
  appId: "1:950693853680:web:1caa87e83da9461b354535",
  measurementId: "G-RYLMH938VY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Initialize Facebook
const providerGoogle = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
  if(user != null){
      location.replace("http://127.0.0.1:5500/index.html");
      window.stop();

      let userSession = auth.currentUser;

      console.log(userSession.email);

      let directUserSession = ref(database, "users/" + userSession.uid + "/profile");

      onValue(directUserSession, (snapshot) => {
          const data = snapshot.val();
      
          var text = document.createTextNode(String(data["username"]));

          document.getElementById("test-input").appendChild(text) ;
        });
  }else if(window.location == "http://127.0.0.1:5500/setting.html" || window.location == "http://127.0.0.1:5500/index.html" || window.location == "http://127.0.0.1:5500/profile.html"){
      window.location = "http://127.0.0.1:5500/login.html";
  }
});

export{
  app,
  database,
  auth,
  providerGoogle,
  GoogleAuthProvider,
  signInWithPopup,
  ref,
  update,
  set,
  onValue,
  updateProfile,
  updatePassword,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};

