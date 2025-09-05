
// Fix: Use namespace imports for Firebase services to avoid potential module resolution issues.
// This can resolve module resolution issues in some environments without changing the API contract,
// ensuring compatibility with other files using Firebase v9 modular syntax.
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firestore from "firebase/firestore";
import * as firebaseStorage from "firebase/storage";

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
const app = firebaseApp.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebaseAuth.getAuth(app);
export const db = firestore.getFirestore(app);
export const storage = firebaseStorage.getStorage(app);
