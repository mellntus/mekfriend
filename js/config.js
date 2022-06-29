import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, update, set, onValue } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

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

onAuthStateChanged(auth, (user) => {
  if(user){
      // location.replace("http://127.0.0.1:5500/index.html");
      // window.stop();
  }{

  }
  // }else if(window.location == "http://127.0.0.1:5500/setting.html" || window.location == "http://127.0.0.1:5500/index.html" || window.location == "http://127.0.0.1:5500/profile.html"){
  //     window.location = "http://127.0.0.1:5500/login.html";
  // }
});

export{
  app,
  database,
  auth,
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

