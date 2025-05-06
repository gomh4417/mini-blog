import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FB_STORAGE,
    messagingSenderId: import.meta.env.VITE_FB_MSG_SEND_ID,
    appId: import.meta.env.VITE_FB_API_ID,
    measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
  }

  const firebaseApp = firebase.initializeApp(firebaseConfig)

  const db = firebaseApp.firestore()
  

  export {firebase, firebaseApp, db}
  export const storage = firebase.storage();
