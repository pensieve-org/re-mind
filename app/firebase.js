import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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

export default auth;

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
