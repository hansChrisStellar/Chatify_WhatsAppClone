import firebase  from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4w2SKH-zrXgLU2xWnypu2U2pGONt3l3Y",
  authDomain: "slack-clone-3b3cc.firebaseapp.com",
  databaseURL: "https://slack-clone-3b3cc-default-rtdb.firebaseio.com",
  projectId: "slack-clone-3b3cc",
  storageBucket: "slack-clone-3b3cc.appspot.com",
  messagingSenderId: "1007894581681",
  appId: "1:1007894581681:web:12141e85ad8a301265ed90"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth(app)
const firebaseDb = firebase.database(app)

export {
  firebaseAuth,
  firebaseDb
}
