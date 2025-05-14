// firebase-init.js

const firebaseConfig = {
  apiKey: 'AIzaSyCwrV3eXmft-FAQNHxbg2EYVYHdaFzAhiI',
  authDomain: 'trabalho-jupe.firebaseapp.com',
  projectId: 'trabalho-jupe',
  storageBucket: 'trabalho-jupe.appspot.com',
  messagingSenderId: '1057718014194',
  appId: '1:1057718014194:web:e12b0cdb44e6f3c5a3006b',
  measurementId: 'G-RN4TCE9PSV',
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
