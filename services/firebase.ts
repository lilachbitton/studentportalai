// Using Firebase v8 compatibility layer to enable v8-style syntax (e.g., firebase.auth())
// This is required because the rest of the app is written using the Firebase v8 API.
// Using full URLs to resolve build errors on Vercel/Vite.
import firebase from 'https://esm.sh/firebase@10.12.2/compat/app';
import 'https://esm.sh/firebase@10.12.2/compat/auth';
import 'https://esm.sh/firebase@10.12.2/compat/firestore';
import 'https://esm.sh/firebase@10.12.2/compat/storage';

// Your web app's Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyAVG6E8aN0D-wlsgh7EGKj6yGAV55j1I9g",
  authDomain: "studentportal-a6495.firebaseapp.com",
  projectId: "studentportal-a6495",
  storageBucket: "studentportal-a6495.appspot.com",
  messagingSenderId: "256260765017",
  appId: "1:256260765017:web:16bf97c3ba042165a24848"
};

// Initialize Firebase if it hasn't been already.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Export the initialized Firebase services for use throughout the app.
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// We also export the core firebase object for things like setting persistence.
export default firebase;