// Fix: Switched to Firebase v8 compat API to resolve module errors. This requires using the namespaced 'firebase' object.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration, corrected based on user's provided config.
const firebaseConfig = {
  apiKey: "AIzaSyAVG6E8aN0D-wlsgh7EGKj6yGAV55j1I9g",
  authDomain: "studentportal-a6495.firebaseapp.com",
  projectId: "studentportal-a6495",
  storageBucket: "studentportal-a6495.appspot.com",
  messagingSenderId: "256260765017",
  appId: "1:256260765017:web:16bf97c3ba042165a24848"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
