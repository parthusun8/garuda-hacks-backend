const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
// const { getStorage, ref  } = require("firebase/storage");

console.log(process.env.FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: "AIzaSyC50LNksXujYtNjmMTArqwh2Qi8vZk45uY",
  authDomain: "garuda-hacks-2022.firebaseapp.com",
  projectId: "garuda-hacks-2022",
  storageBucket: "garuda-hacks-2022.appspot.com",
  messagingSenderId: "567504553288",
  appId: "1:567504553288:web:16fa922a378d1af7b49f7d",
  measurementId: "G-ZDB2P512D7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
// const storage = getStorage(app);
// const imagesRef = ref(storage, 'images');

auth.languageCode = "it";
module.exports = { auth, db };
