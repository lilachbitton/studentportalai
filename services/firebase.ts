import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration, corrected based on screenshots.
const firebaseConfig = {
  apiKey: "AIzaSyAVGEBaND-wIsyhTEGKj6yGAV55j1I9g",
  authDomain: "studentportal-a6495.firebaseapp.com",
  projectId: "studentportal-a6495",
  storageBucket: "studentportal-a6495.appspot.com",
  messagingSenderId: "2562260765017",
  appId: "1:2562260765017:web:16bf97c3ba042165a24848"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
