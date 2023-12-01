import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-ehMsfdg4SPCpcT3m09AhtW-ucnRQPCY",
  authDomain: 're-mind-405009.firebaseapp.com',
  databaseURL: 'https://re-mind-405009-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 're-mind-405009',
  storageBucket: 're-mind-405009.appspot.com',
  messagingSenderId: '309656006737',
  appId: '1:309656006737:ios:b848ad596edd71638bc870',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app); // Initialize Firestore

const storage = getStorage(app);

export { auth, db, storage };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
