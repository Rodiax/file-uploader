import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDr7MlbSnmcidMJCIFpGdQ6Dnp8_IRP4MU",
    authDomain: "file-uploader-601c7.firebaseapp.com",
    projectId: "file-uploader-601c7",
    storageBucket: "file-uploader-601c7.appspot.com",
    messagingSenderId: "343822140427",
    appId: "1:343822140427:web:189f36e0ff22ae1e6f730e"
};

firebase.initializeApp(firebaseConfig);

export { 
    firebase 
};