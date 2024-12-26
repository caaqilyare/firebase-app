import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVjvJxHhzwRxYGVsxH_omz8GKiPAPxZVE",
  authDomain: "modern-login-81611.firebaseapp.com",
  projectId: "modern-login-81611",
  storageBucket: "modern-login-81611.appspot.com",
  messagingSenderId: "1021661593796",
  appId: "1:1021661593796:web:2f2d2ef44d875c0b0d7f88"
}

// Initialize Firebase only if it hasn't been initialized yet
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Get Auth and Firestore instances
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
