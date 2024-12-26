import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAK-JPX0p9h_aOs8O7a_fdUKD1X6J5BMwY",
  authDomain: "fir-login-6605c.firebaseapp.com",
  databaseURL: "https://fir-login-6605c.firebaseio.com",
  projectId: "fir-login-6605c",
  storageBucket: "fir-login-6605c.firebasestorage.app",
  messagingSenderId: "581631828835",
  appId: "1:581631828835:web:30220a43f95b7ba56e6956"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); 