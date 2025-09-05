

// Fix: Corrected Firebase imports to use named imports as required by the Firebase v9 modular SDK.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
