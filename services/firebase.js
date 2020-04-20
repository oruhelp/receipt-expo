import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDNBrZ4iiR5DwkZtbB89OUbBl3SM53U-7M",
    authDomain: "oruhelp-prod.firebaseapp.com",
    databaseURL: "https://oruhelp-prod.firebaseio.com",
    projectId: "oruhelp-prod",
    storageBucket: "oruhelp-prod.appspot.com",
    messagingSenderId: "532464077344",
    appId: "1:532464077344:web:e403fbcaf866c32fb64a45",
    measurementId: "G-PPSZVVY7YZ"

};
class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.auth = firebase.auth();
    this.db = firebase.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signupUserDetails = (uid, userDetails) => {
    return this.db.ref(`users/${uid}/profile`)
          .set({ ...userDetails });
  };

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}
export default Firebase;
